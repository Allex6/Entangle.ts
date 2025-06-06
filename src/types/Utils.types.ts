/**
 * Defines a particle
 */
export type Particle<ParticleType = unknown> = new (
  ...args: any[]
) => ParticleType;

/**
 * Defines a standard callback function
 */
export type Callback<Args extends unknown[] = unknown[]> = (
  ...args: Args
) => void | Promise<void>;
