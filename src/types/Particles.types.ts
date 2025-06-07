import { Particle } from './Utils.types';

/**
 * Defines the particle creation contract
 */
export interface IParticleCreation<
  ParticleType = unknown,
  ParticleParams = unknown[]
> {
  /**
   * The event that triggers the creation of the particle
   */
  upon: string;
  /**
   * The conditional to define if the particle should be created. It is a notation (a.b.c)
   */
  when?: string;
  /**
   * Data to be checked against the `when` clause
   */
  is?: any;
  /**
   * The particle to be created
   */
  build: Particle<ParticleType>;
  /**
   * Defines how the particle should be created
   */
  with?: ParticleParams;
}
