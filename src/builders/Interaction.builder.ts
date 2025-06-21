import { Notation } from '../shared/Notation';
import { QuantumPointer } from '../QuantumPointer';
import { Superposition } from '../Superposition';
import { Interaction, Then } from '../shared/types/Particles.types';
import { Particle } from '../shared/types/Utils.types';

export class InteractionBuilder {
  private readonly interaction: Partial<Interaction> = {};

  constructor(
    private readonly parent: Superposition,
    private readonly event: string
  ) {
    this.interaction.upon = this.event;
  }

  public use<ParticleType>(
    target: Particle<ParticleType> | Notation | QuantumPointer
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

  public then(callback: Then): Superposition {
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
    });

    this.interaction.use = undefined;
    this.interaction.call = undefined;
    this.interaction.with = undefined;
    this.interaction.upon = undefined;
    this.interaction.then = undefined;

    return this.parent;
  }
}
