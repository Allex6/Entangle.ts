import { ErrorHandler } from '../../errors/ErrorHandler';
import { Event } from '../../shared/types/Events.types';
import { Interaction, Target } from '../../shared/types/Interactions.types';
import { Callback, MethodKeys, ResolvableArgs } from '../../shared/types/Utils.types';
import { Superposition } from '../Superposition';

export class InteractionBuilder<
  TParticle extends object,
  TArgs extends unknown[],
  TMethodName extends MethodKeys<TParticle> | null = null,
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly interaction: Partial<Interaction<TParticle, TArgs, any>> = {};

  constructor(
    private readonly parent: Superposition,
    private readonly event: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialInteraction: Partial<Interaction<TParticle, TArgs, any>> = {}
  ) {
    this.interaction = { ...initialInteraction, upon: this.event };
  }

  public use(target: Target<TParticle, TArgs>): this {
    this.interaction.use = target;
    return this;
  }

  /**
   * Specifies the method to be called on the target particle.
   * @param method The name of a method that exists on the target particle.
   * @returns A NEW, more specific, InteractionBuilder instance.
   */
  public call<TNewMethodName extends MethodKeys<TParticle>>(
    method: TNewMethodName
  ): InteractionBuilder<TParticle, TArgs, TNewMethodName> {
    return new InteractionBuilder(this.parent, this.event, {
      ...this.interaction,
      call: method,
    });
  }

  /**
   * Provides the arguments for the method specified in `.call()`.
   * The arguments are strongly typed based on the chosen method.
   */
  public with(
    ...args: TMethodName extends MethodKeys<TParticle>
      ? ResolvableArgs<Parameters<Extract<TParticle[TMethodName], (...args: unknown[]) => unknown>>>
      : never
  ): this {
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

  public once(): this {
    this.interaction.once = true;
    return this;
  }

  public entanglement(entanglement: string): this {
    this.interaction.entanglement = entanglement;
    return this;
  }

  public errorHandler(errorHandler: ErrorHandler): this {
    this.interaction.errorHandler = errorHandler;
    return this;
  }

  public then(callback?: Callback): Superposition {
    this.interaction.then = callback;

    if (!this.interaction.use || !this.interaction.call || !this.interaction.entanglement) {
      throw new Error(
        'Invalid interaction provided. You must call both "use" and "call" methods before calling "with"'
      );
    }

    this.parent.addInteraction(this.interaction as Interaction<TParticle, TArgs>);

    return this.parent;
  }
}
