import { Superposition } from '../Superposition';
import { IParticleCreation } from '../types/Particles.types';
import { Particle } from '../types/Utils.types';

export class ParticleContractBuilder {
  private readonly contract: Partial<IParticleCreation> = {};

  constructor(private readonly parent: Superposition) {}

  public upon(event: string): this {
    this.contract.upon = event;
    return this;
  }

  public build<ParticleType>(particleClass: Particle<ParticleType>): this {
    this.contract.build = particleClass;
    return this;
  }

  public when(notation: string): this {
    this.contract.when = notation;
    return this;
  }

  public is(value: any): this {
    this.contract.is = value;
    return this;
  }

  public with(...args: unknown[]): Superposition {
    this.contract.with ??= args;

    // If both upon and build are missing, we cannot create a particle
    if (!this.contract.upon || !this.contract.build) {
      throw new Error('Missing required properties');
    }

    // Adds a new particle creation contract
    this.parent.addContract({
      upon: this.contract.upon,
      when: this.contract.when,
      with: this.contract.with,
      is: this.contract.is,
      build: this.contract.build,
    });

    // Reset the particle that were being configured
    this.contract.upon = undefined;
    this.contract.when = undefined;
    this.contract.is = undefined;
    this.contract.build = undefined;
    this.contract.with = undefined;

    return this.parent;
  }
}
