import { Aether } from '../aether';
import { ErrorHandler } from '../errors/ErrorHandler';
import { EventHorizon } from '../event-horizon/EventHorizon';
import { HiggsField } from '../higgs-field/HiggsField';
import { QuantumPointer } from '../quantum-pointer/QuantumPointer';
import { Notation } from '../shared/Notation';
import { Event } from '../shared/types/Events.types';
import { Interaction } from '../shared/types/Interactions.types';
import { Particle, ParticleCreation } from '../shared/types/Particles.types';
import { GatewayBuilder } from './builders/Gateway.builder';

/**
 * In quantum mechanics, Superposition is the principle that a system can exist in
 * multiple potential states at once, collapsing into a single reality upon observation.
 *
 * In Entangle.ts, the `Superposition` class is the embodiment of this principle.
 * It is the central orchestrator—the "laws of physics" for your application.
 * It listens for events from the Aether, consults the EventHorizon for historical
 * context, and executes rule-based interactions, creating and manipulating
 * particles within the HiggsField and its temporary scopes.
 *
 * @class Superposition
 */
export class Superposition {
  public readonly particlesContracts = new Map<number, ParticleCreation>();
  public readonly contracts: ParticleCreation<any, any>[] = [];
  public readonly interactions: Interaction<any, any, any>[] = [];
  private errorHandler: ErrorHandler = ErrorHandler.create();

  /**
   * @param aether The communication medium, responsible for event transport.
   * @param higgs The foundational field, the main container for service particles.
   * @param horizon The historical record, providing context of all past events.
   */
  constructor(
    private readonly aether: Aether,
    private readonly higgs: HiggsField,
    private readonly horizon: EventHorizon
  ) {}

  /**
   * Begins the declarative definition of a rule that is triggered by a specific event.
   * This is the entry point for defining any "law" in the application.
   * @param event The name of the event that triggers the rule.
   * @returns A `GatewayBuilder` instance to continue defining the rule by choosing an
   * action (`.build()` or `.use()`).
   */
  public upon(event: Event): GatewayBuilder<any, any[]> {
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
   * Checks if a particle creation rule can be executed based on its `when` clause.
   * @internal
   */
  private canCreateAParticle(contract: ParticleCreation): boolean {
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
   * Creates a particle instance and registers it within the specified scope
   * (or the main HiggsField if no scope is provided), making it available for
   * other interactions.
   * @internal
   */
  private createAParticle(contract: ParticleCreation): void {
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

    try {
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

        particleInstance = new (build as new (
          ...args: any[]
        ) => Particle<any>)();
      }

      if (then) {
        then(particleInstance);
      }
    } catch (err) {
      this.errorHandler.handle(err);
    }
  }

  /**
   * Registers a particle creation contract, setting up a listener for its trigger event.
   * This method is intended to be called by a builder.
   * @internal
   */
  public addContract<TInstance, TArgs extends any[]>(
    contract: ParticleCreation<TInstance, TArgs>
  ): this {
    const { upon } = contract;

    this.aether.once(upon, (...args: any[]) => {
      this.horizon.add(upon, args);
      this.checkForParticlesCreation(upon);
      this.checkForParticlesInteractions(upon);
    });

    this.contracts.push(contract);
    return this;
  }

  /**
   * Registers an interaction contract, setting up a listener if it's event-driven.
   * This method is intended to be called by a builder.
   * @internal
   */
  public addInteraction<TInstance, TArgs extends any[]>(
    interaction: Interaction<TInstance, TArgs>
  ): this {
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

  /**
   * Checks for and executes all interaction rules triggered by a specific event.
   * @internal
   */
  private checkForParticlesInteractions(event: string) {
    const filteredInteractions = this.interactions.filter(
      (i) => i.upon === event
    );

    for (const interaction of filteredInteractions) {
      const { use: target } = interaction;
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

      this.interact(interaction, instance);
    }
  }

  private interact(interaction: Interaction, instance: unknown) {
    const { use: target, call, with: args, then } = interaction;

    try {
      const result = (instance as Record<string, (...args: any[]) => any>)[
        call
      ](...(args ?? []));

      if (then) {
        then(result);
      }

      if (!this.higgs.getParticleOptions(target as Particle)?.persist) {
        this.higgs.destroy(target as Particle);
      }
    } catch (err) {
      this.errorHandler.handle(err);
    }
  }

  public catch(errorHandler: ErrorHandler): this {
    this.errorHandler = errorHandler;
    return this;
  }
}
