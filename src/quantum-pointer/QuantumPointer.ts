import { HiggsField } from '../higgs-field/HiggsField';
import { Particle } from '../shared/types/Particles.types';

/**
 * Represents a lazy, deferred reference to a particle within a specific scope.
 *
 * In our physics analogy, a QuantumPointer doesn't hold the particle itself,
 * but rather "points" to a location in a "bubble universe" (a scope)
 * where a particle is expected to exist. The actual particle is only resolved
 * or "collapsed" from its potential state when the `.get()` method is called.
 *
 * This solves the problem of needing to reference a particle that might not have
 * been instantiated at the moment a rule is defined.
 *
 * @template T The expected type of the particle instance.
 */
export class QuantumPointer<TParticle, TArgs extends unknown[]> {
  /**
   * The constructor is private to enforce the use of the static `create` method,
   * leading to a cleaner and more declarative API.
   * @param particleClass The class of the particle to be retrieved.
   * @param scope The specific scope (HiggsField instance) to search within.
   */
  private constructor(
    private readonly particleClass: Particle<TParticle, TArgs>,
    private readonly scope: HiggsField
  ) {}

  /**
   * Creates a new instance of a QuantumPointer.
   * @template T The expected type of the particle instance.
   * @param particleClass The class of the particle to be retrieved.
   * @param scope The specific scope (HiggsField instance) where the particle is expected to be.
   * @returns A new `QuantumPointer` instance.
   */
  static create<TParticle, TArgs extends unknown[]>(
    particleClass: Particle<TParticle, TArgs>,
    scope: HiggsField
  ): QuantumPointer<TParticle, TArgs> {
    return new QuantumPointer(particleClass, scope);
  }

  /**
   * Resolves the pointer and retrieves the actual particle instance from the scope.
   * This is the "observation" that collapses the potential state into a concrete instance.
   * @returns The resolved particle instance.
   */
  public get(): TParticle {
    return this.scope.get(this.particleClass);
  }
}
