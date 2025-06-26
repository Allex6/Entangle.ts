import { HiggsField } from '../../higgs-field/HiggsField';
import { Event } from './Events.types';
import { Callback } from './Utils.types';

/**
 * Represents a constructable class in our universe (a "Particle").
 * @template TInstance The type of the instance created by the class.
 * @template TArgs A tuple type representing the constructor's arguments.
 */
export type Particle<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[]
> = new (...args: TArgs) => TInstance;

/**
 * Represents a blueprint (contract) for creating a dynamic particle.
 * It declaratively defines the trigger, conditions, and dependencies for instantiation.
 * @template TInstance The type of the instance to be built.
 * @template TArgs The tuple type for the constructor arguments of the instance.
 */
export interface ParticleCreation<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[]
> {
  /**
   * The event that triggers the creation of the particle.
   */
  upon: Event;
  /**
   * A notation (e.g., 'a.b.c') pointing to data within the event payload,
   * used as a condition to allow particle creation.
   */
  when?: string;
  /**
   * The value to be checked against the data retrieved via the 'when' clause.
   */
  is?: unknown;
  /**
   * The particle class to be instantiated.
   */
  build: Particle<TInstance, TArgs>;
  /**
   * An array of arguments to be passed to the particle's constructor.
   * The types must match the constructor's signature.
   */
  using?: TArgs;
  /**
   * A callback that will be invoked after the particle is created,
   * receiving the new instance as its argument.
   */
  then?: Callback<[TInstance], void>;
  /**
   * Defines the temporary scope where the newly created
   * particle instance will be stored.
   */
  scope?: HiggsField;
  /**
   * Defines the event that should be issued after the particle creation.
   * It will contain the particle itself as argument.
   */
  emit?: Event;
  /**
   * Represents a list of events that must have happened in order to allow the creation of the particle.
   */
  requirements?: Event[];
}
