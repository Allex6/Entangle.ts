import { QuantumPointer } from '../../quantum-pointer/QuantumPointer';
import { Notation } from '../../shared/Notation';
import { Event } from '../../shared/types/Events.types';
import { Interaction } from '../../shared/types/Interactions.types';
import { Particle } from '../../shared/types/Particles.types';
import { Callback } from '../../shared/types/Utils.types';
import { Superposition } from '../Superposition';

export class InteractionBuilder<TInstance, TArgs extends any[]> {
  private readonly interaction: Partial<Interaction> = {};

  constructor(
    private readonly parent: Superposition,
    private readonly event: string
  ) {
    this.interaction.upon = this.event;
  }

  public use<ParticleType>(
    target: Particle<ParticleType> | Notation | QuantumPointer<TInstance, TArgs>
  ): this {
    this.interaction.use = target;
    return this;
  }

  public call(method: string): this {
    this.interaction.call = method;
    return this;
  }

  public with(...args: unknown[]): this {
    this.interaction.with = args;
    return this;
  }

  public emit(event: Event): this {
    this.interaction.emit = event;
    return this;
  }

  public requirements(events: Event[]): this {
    this.interaction.requirements = events;
    return this;
  }

  public then(callback?: Callback): Superposition {
    this.interaction.then = callback;

    if (!this.interaction.use || !this.interaction.call) {
      throw new Error(
        'Invalid interaction provided. You must call both "use" and "call" methods before calling "with"'
      );
    }

    this.parent.addInteraction({
      upon: this.interaction.upon,
      use: this.interaction.use,
      call: this.interaction.call,
      with: this.interaction.with,
      then: this.interaction.then,
      emit: this.interaction.emit,
      requirements: this.interaction.requirements,
    });

    this.interaction.use = undefined;
    this.interaction.call = undefined;
    this.interaction.with = undefined;
    this.interaction.upon = undefined;
    this.interaction.then = undefined;
    this.interaction.emit = undefined;
    this.interaction.requirements = undefined;

    return this.parent;
  }
}
