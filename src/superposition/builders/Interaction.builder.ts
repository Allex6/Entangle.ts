import { Event } from '../../shared/types/Events.types';
import { Interaction, Target } from '../../shared/types/Interactions.types';
import { Callback } from '../../shared/types/Utils.types';
import { Superposition } from '../Superposition';

export class InteractionBuilder<TParticle, TArgs extends unknown[]> {
  private readonly interaction: Partial<
    Interaction<TParticle, TArgs, unknown>
  > = {};

  constructor(
    private readonly parent: Superposition,
    private readonly event: string
  ) {
    this.interaction.upon = this.event;
  }

  public use(target: Target<TParticle, TArgs>): this {
    this.interaction.use = target;
    return this;
  }

  public call(method: string): this {
    this.interaction.call = method;
    return this;
  }

  public with(...args: TArgs): this {
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

    return this.parent;
  }
}
