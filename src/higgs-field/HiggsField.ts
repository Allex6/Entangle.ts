import { Particle } from '../shared/types/Particles.types';

/**
 * The Higgs Field gives "mass" (substance) to particle classes,
 * turning them into real, usable instances. It acts as a hierarchical
 * dependency injection container that manages object lifecycles and scopes.
 */
export class HiggsField {
  private readonly particles = new Map<Particle, any>();
  private readonly factories = new Map<Particle | string, FactoryMap>();

  /**
   * Creates a new HiggsField, optionally linking it to a parent scope.
   * @param parent The parent field, used for hierarchical dependency resolution.
   */
  constructor(private readonly parent?: HiggsField) {}

  /**
   * Registers a factory function that defines how to create a particle.
   * @template T The type of the particle instance.
   * @param particleClass The class constructor for the particle.
   * @param factory The function that returns a new instance of the particle.
   * @param options Lifecycle options for the particle (e.g., scope).
   */
  public register<T>(
    particleClass: Particle<T> | string,
    factory: () => T,
    options: ParticleOptions = { scope: 'singleton' }
  ): void {
    this.factories.set(particleClass, { factory, options });
  }

  /**
   * Retrieves an instance of a particle, respecting its scope and the scope hierarchy.
   * @template T The expected type of the particle instance.
   * @param particleClass The class used to register the particle.
   * @returns An instance of the particle.
   * @throws {Error} If the particle is not registered in this scope or any parent scope.
   */
  public get<T>(particleClass: Particle<T>): T {
    const registration = this.factories.get(particleClass);
    if (!registration) {
      throw new Error(`Particle ${particleClass.name} is not registered.`);
    }

    if (registration.options.scope === 'transient') {
      return registration.factory();
    }

    if (!this.particles.has(particleClass)) {
      const newInstance = registration.factory();
      this.particles.set(particleClass, newInstance);
    }

    return this.particles.get(particleClass) as T;
  }

  /**
   * Destroy a particle
   */
  public destroy(particleClass: Particle): void {
    this.particles.delete(particleClass);
  }

  /**
   * Helper method used to get a particle object of options defined upon creation
   */
  public getParticleOptions(
    particleClass: Particle
  ): ParticleOptions | undefined {
    return this.factories.get(particleClass)?.options;
  }

  /**
   * Creates a new child scope (a "bubble universe") of this Higgs Field.
   * This new scope is isolated but can resolve dependencies from its parent.
   * @returns A new, scoped `HiggsField` instance.
   */
  public createScope(): HiggsField {
    return new HiggsField(this);
  }
}

/**
 * Options defining a particle's lifecycle and behavior within the HiggsField.
 */
interface ParticleOptions {
  /**
   * Defines the lifecycle of the particle.
   * 'singleton': A single instance is created and shared throughout the scope.
   * 'transient': A new instance is created every time the particle is requested.
   */
  scope: 'singleton' | 'transient';
  /**
   * Defines if the particle should be destroyed after usage
   */
  persist?: boolean;
}

interface FactoryMap {
  factory: () => any;
  options: ParticleOptions;
}
