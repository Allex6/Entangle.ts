import { ErrorHandler } from '../../errors/ErrorHandler';
import { HiggsField } from '../../higgs-field/HiggsField';
import { NotationString } from '../Notation';
import { Event } from './Events.types';
import { Callback, ResolvableArgs } from './Utils.types';

/**
 * Represents a constructable class in our universe (a "Particle").
 * @template TParticle The type of the instance created by the class.
 * @template TArgs A tuple type representing the constructor's arguments.
 */
export type Particle<TParticle = unknown, TArgs extends unknown[] = unknown[]> = new (
  ...args: TArgs
) => TParticle;

/**
 * Represents a blueprint (contract) for creating a dynamic particle.
 * It declaratively defines the trigger, conditions, and dependencies for instantiation.
 * @template TParticle The type of the instance to be built.
 * @template TArgs The tuple type for the constructor arguments of the instance.
 */
export interface ParticleProperties<TParticle = unknown, TArgs extends unknown[] = unknown[]> {
  /**
   * The event that triggers the creation of the particle.
   */
  upon: Event;
  /**
   * Represents the quantum entanglement of this particle with the rest of the system
   */
  entanglement: Entanglement;
  /**
   * A notation (e.g., 'a.b.c') pointing to data within the event payload,
   * used as a condition to allow particle creation.
   */
  when?: NotationString;
  /**
   * The value to be checked against the data retrieved via the 'when' clause.
   */
  is?: unknown;
  /**
   * The particle class to be instantiated.
   */
  build: Particle<TParticle, TArgs>;
  /**
   * An array of arguments to be passed to the particle's constructor.
   * The types must match the constructor's signature.
   */
  using?: ResolvableArgs<TArgs>;
  /**
   * A callback that will be invoked after the particle is created,
   * receiving the new instance as its argument.
   */
  then?: Callback<[TParticle], void>;
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
  /**
   * Defines the lifecycle of the particle.
   * 'singleton': A single instance is created and shared throughout the scope.
   * 'transient': A new instance is created every time the particle is requested.
   */
  lifecycle: ParticleLifecycle;
  /**
   * Defines if the particle should be destroyed after usage
   */
  destroyOnInteraction?: boolean;
  /**
   * Defines if the event should be listened only once
   */
  once?: boolean;
  /**
   * Handle possible erros upon this particle creation
   */
  errorHandler?: ErrorHandler;
}

/**
 * Represents the lifecycle of the particle.
 */
export type ParticleLifecycle = 'singleton' | 'transient';

/**
 * The quantum entanglement id, which represents the correlation between particles or interactions
 */
export type Entanglement = string;

/**
 * Represents the fundamental carrier of information for an event.
 * In our physics analogy, the Boson is the force-carrying particle
 * that holds the event's data and the entanglement ID, ensuring
 * a correlated and traceable interaction.
 *
 * @template TData The type of the primary data being carried.
 */
export interface Boson<TData extends unknown[] = unknown[]> {
  payload: TData;
  entanglement: Entanglement;
  timestamp: number;
}
