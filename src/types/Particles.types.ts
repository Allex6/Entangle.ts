import { Particle } from './Utils.types';

/**
 * Defines the particle creation contract
 */
export interface IParticleCreation<
  ParticleType = unknown,
  ParticleParams = unknown
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
  with?: IWith<ParticleParams>;
}

/**
 * Defines how the particle should be created
 */
export interface IWith<ParticleParams = unknown> {
  /**
   * Params that should be used to create the particle
   */
  params?: ParticleParams;
  /**
   * Defines if the particle should be created without params
   */
  empty?: boolean;
  /**
   * Defines the notation to be used to get the data that should be used to create the particle
   */
  notation?: string;
}
