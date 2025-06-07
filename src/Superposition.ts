import { Particle } from './types/Utils.types';
import { IParticleCreation } from './types/Particles.types';
import { Aether } from './Aether';
import { HiggsField } from './HiggsField';
import { EventHorizon } from './EventHorizon';
import { ParticleContractBuilder } from './builders/Particle.builder';
import { Notation } from './Notation';

export class Superposition {
  public readonly particlesContracts = new Map<number, IParticleCreation>();
  public readonly contracts: IParticleCreation[] = [];

  constructor(
    private readonly aether: Aether,
    private readonly higgs: HiggsField,
    private readonly horizon: EventHorizon
  ) {}

  public upon(event: string): ParticleContractBuilder {
    return new ParticleContractBuilder(this).upon(event);
  }

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

  private createAParticle(contract: IParticleCreation): void {
    const { upon, build, with: withClause } = contract;

    const parsedArgs = withClause?.map((arg) => {
      if (arg instanceof Notation) {
        return arg.getData(this.horizon.query().from(upon).get());
      }

      return arg;
    });

    if (parsedArgs) {
      this.higgs.set(
        build,
        new (build as new (...args: any[]) => Particle<any>)(...parsedArgs)
      );
    } else {
      this.higgs.set(
        build,
        new (build as new (...args: any[]) => Particle<any>)()
      );
    }
  }

  public addContract(contract: IParticleCreation): this {
    const { upon } = contract;

    this.aether.once(upon, (...args: any[]) => {
      this.horizon.add(upon, args);
      this.checkForParticlesCreation(upon);
    });

    this.contracts.push(contract);
    return this;
  }
}
