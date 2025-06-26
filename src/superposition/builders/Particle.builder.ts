import { HiggsField } from '../../higgs-field/HiggsField';
import { Event } from '../../shared/types/Events.types';
import { Particle, ParticleCreation } from '../../shared/types/Particles.types';
import { Callback } from '../../shared/types/Utils.types';
import { Superposition } from '../Superposition';

export class ParticleContractBuilder<TInstance, TArgs extends any[]> {
  private readonly contract: Partial<ParticleCreation<TInstance, TArgs>> = {};

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

  public build(particleClass: Particle<TInstance, TArgs>): this {
    this.contract.build = particleClass;
    return this;
  }

  public inScope(scope: HiggsField): this {
    this.contract.scope = scope;
    return this;
  }

  public using(...args: TArgs): this {
    this.contract.using = args;
    return this;
  }

  public emit(event: Event): this {
    this.contract.emit = event;
    return this;
  }

  public requirements(events: Event[]): this {
    this.contract.requirements = events;
    return this;
  }

  public then(callback?: Callback<[TInstance]>): Superposition {
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
      emit: this.contract.emit,
      requirements: this.contract.requirements,
    });

    // Reset the particle that were being configured
    this.contract.upon = undefined;
    this.contract.when = undefined;
    this.contract.is = undefined;
    this.contract.build = undefined;
    this.contract.using = undefined;
    this.contract.scope = undefined;
    this.contract.then = undefined;
    this.contract.emit = undefined;
    this.contract.requirements = undefined;

    return this.parent;
  }
}
