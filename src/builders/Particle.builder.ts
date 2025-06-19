import { HiggsField } from '../HiggsField';
import { Superposition } from '../Superposition';
import { IParticleCreation, Then } from '../types/Particles.types';
import { Particle } from '../types/Utils.types';

export class ParticleContractBuilder {
  private readonly contract: Partial<IParticleCreation> = {};

  constructor(
    private readonly parent: Superposition,
    private readonly _event: string,
    private readonly _when?: string,
    private readonly _is?: any
  ) {
    this.contract.upon = this._event;
    this.contract.when = this._when;
    this.contract.is = this._is;
  }

  public build<ParticleType>(particleClass: Particle<ParticleType>): this {
    this.contract.build = particleClass;
    return this;
  }

  public inScope(scope: HiggsField): this {
    this.contract.scope = scope;
    return this;
  }

  public using(...args: unknown[]): this {
    this.contract.using = args;
    return this;
  }

  public then(callback: Then): Superposition {
    // If both upon and build are missing, we cannot create a particle
    if (!this.contract.upon || !this.contract.build) {
      throw new Error('Missing required properties');
    }

    this.contract.then = callback;

    this.parent.addContract({
      upon: this.contract.upon,
      when: this.contract.when,
      is: this.contract.is,
      build: this.contract.build,
      using: this.contract.using,
      scope: this.contract.scope,
      then: this.contract.then,
    });

    // Reset the particle that were being configured
    this.contract.upon = undefined;
    this.contract.when = undefined;
    this.contract.is = undefined;
    this.contract.build = undefined;
    this.contract.using = undefined;
    this.contract.scope = undefined;
    this.contract.then = undefined;

    return this.parent;
  }
}
