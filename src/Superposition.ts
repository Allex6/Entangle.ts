import { Particle } from './types/Utils.types';
import { Interaction, IParticleCreation } from './types/Particles.types';
import { Aether } from './Aether';
import { HiggsField } from './HiggsField';
import { EventHorizon } from './EventHorizon';
import { Notation } from './Notation';
import { GatewayBuilder } from './builders/Gateway.builder';
import { QuantumPointer } from './QuantumPointer';

export class Superposition {
  public readonly particlesContracts = new Map<number, IParticleCreation>();
  public readonly contracts: IParticleCreation[] = [];
  public readonly interactions: Interaction[] = [];

  constructor(
    private readonly aether: Aether,
    private readonly higgs: HiggsField,
    private readonly horizon: EventHorizon
  ) {}

  /**
   * When an event happens
   */
  public upon(event: string): GatewayBuilder {
    return new GatewayBuilder(this, event);
  }

  /**
   * Check if there are any particles that can be created
   */
  private checkForParticlesCreation(event: string) {
    const filteredContracts = this.contracts.filter(
      (contract) => contract.upon === event
    );

    for (const contract of filteredContracts) {
      const shouldCreateAParticle = this.canCreateAParticle(contract);

      if (shouldCreateAParticle) {
        this.createAParticle(contract);
      }
    }
  }

  /**
   * Check if a specific particle can be created
   */
  private canCreateAParticle(contract: IParticleCreation): boolean {
    const { upon, when, is } = contract;

    // Checks if the 'when' clause is satisfied
    if (typeof when !== 'undefined') {
      const data = this.horizon.query().from(upon).get();
      const parsedData = Notation.create(when).getData(data);
      if (parsedData !== is) {
        return false;
      }
    }

    return true;
  }

  /**
   * Creates a particle
   */
  private createAParticle(contract: IParticleCreation): void {
    const { upon, build, using, then, scope } = contract;
    const context = scope ?? this.higgs;

    const parsedArgs = using?.map((arg) => {
      if (arg instanceof Notation) {
        return arg.getData(this.horizon.query().from(upon).get());
      }

      if (arg instanceof QuantumPointer) {
        return arg.get();
      }

      return arg;
    });

    let particleInstance;

    if (parsedArgs) {
      context.register(
        build,
        () =>
          new (build as new (...args: any[]) => Particle<any>)(...parsedArgs),
        { persist: false, scope: 'singleton' }
      );

      particleInstance = new (build as new (...args: any[]) => Particle<any>)(
        ...parsedArgs
      );
    } else {
      context.register(
        build,
        () => new (build as new (...args: any[]) => Particle<any>)(),
        { persist: false, scope: 'singleton' }
      );

      particleInstance = new (build as new (...args: any[]) => Particle<any>)();
    }

    if (then) {
      then(particleInstance);
    }
  }

  /**
   * Adds a new contract of a particle creation
   */
  public addContract(contract: IParticleCreation): this {
    const { upon } = contract;

    this.aether.once(upon, (...args: any[]) => {
      this.horizon.add(upon, args);
      this.checkForParticlesCreation(upon);
      this.checkForParticlesInteractions(upon);
    });

    this.contracts.push(contract);
    return this;
  }

  public addInteraction(interaction: Interaction): this {
    this.interactions.push(interaction);

    const { upon } = interaction;

    if (upon) {
      this.aether.once(upon, (...args: any[]) => {
        this.horizon.add(upon, args);
        this.checkForParticlesCreation(upon);
        this.checkForParticlesInteractions(upon);
      });
    }

    return this;
  }

  private checkForParticlesInteractions(event: string) {
    const filteredInteractions = this.interactions.filter(
      (i) => i.upon === event
    );

    for (const interaction of filteredInteractions) {
      const { use: target, call, with: args, then } = interaction;
      let instance: unknown;

      if (target instanceof Notation) {
        instance = this.horizon.query().using(target.get()).get();
      } else if (target instanceof QuantumPointer) {
        instance = target.get();
      } else {
        instance = this.higgs.get(target as Particle);
      }

      if (!instance) {
        throw new Error('Instance could not be resolved from target.');
      }

      const result = (instance as Record<string, (...args: any[]) => any>)[
        call
      ](...(args ?? []));

      if (then) {
        then(result);
      }

      if (!this.higgs.getParticleOptions(target as Particle)?.persist) {
        this.higgs.destroy(target as Particle);
      }
    }
  }
}
