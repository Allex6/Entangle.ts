import { Particle } from './types/Utils.types';

/**
 * The Higgs Field gives "mass" (substance) to particle classes,
 * turning them into real, usable instances.
 * It holds and serves all particle instances.
 */
export class HiggsField {
  private readonly particles = new Map<Particle, any>();
  private readonly factories = new Map<Particle | string, FactoryMap>();

  /**
   * Defines how a particle should be created
   */
  public register<T>(
    particleClass: Particle<T> | string,
    factory: () => T,
    options: ParticleOptions = { scope: 'singleton' }
  ): void {
    this.factories.set(particleClass, { factory, options });
  }

  /**
   * Gets an instance of a particle.
   * If the particle has not been instantiated yet, it will be created.
   * @param particleClass The particle class to instantiate.
   * @returns An instance of the particle.
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
   * It creates a new "bubble universe", which is an isolated universe that holds it's own particles
   * @returns A new HiggsField
   */
  public createScope(): HiggsField {
    return new HiggsField();
  }
}

interface ParticleOptions {
  scope: 'singleton' | 'transient';
  persist?: boolean;
}

interface FactoryMap {
  factory: () => any;
  options: ParticleOptions;
}
