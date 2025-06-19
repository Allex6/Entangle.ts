import { Notation } from '../Notation';
import { Superposition } from '../Superposition';
import { Interaction } from '../types/Particles.types';
import { Particle } from '../types/Utils.types';

export class InteractionBuilder {
  private readonly interaction: Partial<Interaction> = {};

  constructor(
    private readonly parent: Superposition,
    private readonly event: string
  ) {
    this.interaction.upon = this.event;
  }

  public use<ParticleType>(target: Particle<ParticleType> | Notation): this {
    this.interaction.use = target;
    return this;
  }

  public call(method: string): this {
    this.interaction.call = method;
    return this;
  }

  public with(...args: unknown[]): Superposition {
    this.interaction.with = args;

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
    });

    this.interaction.use = undefined;
    this.interaction.call = undefined;
    this.interaction.with = undefined;

    return this.parent;
  }
}
