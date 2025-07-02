import { HiggsField } from '../../higgs-field/HiggsField';
import { NotationString } from '../../shared/Notation';
import { Event } from '../../shared/types/Events.types';
import {
  Particle,
  ParticleLifecycle,
  ParticleProperties,
} from '../../shared/types/Particles.types';
import { Callback, ResolvableArgs } from '../../shared/types/Utils.types';
import { Superposition } from '../Superposition';

export class ParticleContractBuilder<TParticle, TArgs extends unknown[]> {
  private readonly contract: Partial<ParticleProperties<TParticle, TArgs>> = {};

  constructor(
    private readonly parent: Superposition,
    private readonly _event: string,
    private readonly _when?: NotationString,
    private readonly _is?: any
  ) {
    this.contract.upon = this._event;
    this.contract.when = this._when;
    this.contract.is = this._is;
  }

  public build(particleClass: Particle<TParticle, TArgs>): this {
    this.contract.build = particleClass;
    return this;
  }

  public inScope(scope: HiggsField): this {
    this.contract.scope = scope;
    return this;
  }

  public using(...args: ResolvableArgs<TArgs>): this {
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

  public lifecycle(lifecycle: ParticleLifecycle): this {
    this.contract.lifecycle = lifecycle;
    return this;
  }

  public destroyOnInteraction(shouldDestroy: boolean): this {
    this.contract.destroyOnInteraction = shouldDestroy;
    return this;
  }

  public when(notationString: NotationString): this {
    this.contract.when = notationString;
    return this;
  }

  public is(value: unknown): this {
    this.contract.is = value;
    return this;
  }

  public once(): this {
    this.contract.once = true;
    return this;
  }

  public entanglement(entanglement: string): this {
    this.contract.entanglement = entanglement;
    return this;
  }

  public then(callback?: Callback<[TParticle]>): Superposition {
    // If both upon and build are missing, we cannot create a particle
    if (
      !this.contract.upon ||
      !this.contract.build ||
      !this.contract.entanglement
    ) {
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
      lifecycle: this.contract.lifecycle ?? 'singleton',
      destroyOnInteraction: this.contract.destroyOnInteraction,
      once: this.contract.once,
      entanglement: this.contract.entanglement,
    });

    return this.parent;
  }
}
