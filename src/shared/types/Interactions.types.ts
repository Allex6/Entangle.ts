// Em seu arquivo de tipos

import { QuantumPointer } from '../../quantum-pointer/QuantumPointer'; // ou ScopeRetriever
import { Notation } from '../Notation';
import { Event } from './Events.types';
import { Particle } from './Particles.types';
import { Callback, MethodKeys, ResolvableArgs } from './Utils.types';

/**
 * Represents a blueprint for executing a method on a particle.
 * It declaratively defines the trigger, the target particle, the method to call,
 * and the arguments to use.
 * @template TParticle The type of the target particle's instance.
 * @template TArgs A tuple type for the arguments of the method to be called.
 * @template TResult The return type of the method to be called.
 */
export interface Interaction<
  TParticle extends object,
  TArgs extends unknown[],
  TMethodName extends MethodKeys<TParticle> = MethodKeys<TParticle>,
  TResult = unknown
> {
  /**
   * The event that triggers this interaction.
   */
  upon?: Event;
  /**
   * The target particle for the interaction. Can be a reference to a service class,
   * a notation to data in an event payload, or a pointer to a particle in a temporary scope.
   */
  use: Target<TParticle, TArgs>;
  /**
   * The name of the method to be invoked on the target particle instance.
   */
  call: TMethodName;
  /**
   * An array of arguments to be passed to the invoked method.
   */
  with?: ResolvableArgs<unknown[]>;
  /**
   * A callback that will be invoked after the interaction, receiving the result
   * of the method call as its argument.
   */
  then?: Callback<[TResult], void>;
  /**
   * Defines the event that should be issued after the interaction.
   * It will contain the interaction result as an argument.
   */
  emit?: Event;
  /**
   * Represents a list of events that must have happened in order to allow the intended interaction.
   */
  requirements?: Event[];
}

export type Target<TParticle, TArgs extends unknown[]> =
  | Particle<TParticle, TArgs>
  | Notation<unknown, unknown>
  | QuantumPointer<TParticle, TArgs>;
