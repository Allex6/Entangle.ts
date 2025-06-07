import { Particle } from './types/Utils.types';

/**
 * The Higgs Field gives "mass" (substance) to particle classes,
 * turning them into real, usable instances.
 * It holds and serves all singleton particle instances.
 */
export class HiggsField {
  private readonly particles = new Map<Particle, any>();
  private readonly factories = new Map<Particle, () => any>();

  /**
   * Defines how a particle should be created
   */
  public register<T>(
    particleClass: Particle<T>,
    factory: () => T // The function that generates the particle
  ): void {
    this.factories.set(particleClass, factory);
  }

  /**
   * Gets an instance of a particle.
   * If the particle has not been instantiated yet, it will be created.
   * @param particleClass The particle class to instantiate.
   * @returns An instance of the particle.
   */
  public get<T>(particleClass: Particle<T>): T {
    if (!this.particles.has(particleClass)) {
      const factory = this.factories.get(particleClass);

      if (!factory) {
        // If there is no factory registered for the particle, we cannot create it
        throw new Error(`Particle ${particleClass.name} is not registered.`);
      }

      const newInstance = factory();
      this.particles.set(particleClass, newInstance);
    }

    return this.particles.get(particleClass) as T;
  }

  /**
   * Sets an intance of a particle
   * @param particleClass The particle class
   * @param instance An instance of the particle
   */
  public set<T>(particleClass: Particle<T>, instance: T): this {
    this.particles.set(particleClass, instance);
    return this;
  }
}
