import { HiggsField } from '../HiggsField';
import { Notation } from '../Notation';
import { QuantumPointer } from '../QuantumPointer';
import { Particle } from './Utils.types';

/**
 * Defines the particle creation contract
 */
export interface IParticleCreation<
  ParticleType = unknown,
  ParticleArgs = unknown[]
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
  using?: ParticleArgs;
  /**
   * A callback that will be invoked after particle creation and receive it's instance
   */
  then?: (particle: ParticleType) => void;
  /**
   * Defines where the particle is going to be saved
   */
  scope?: HiggsField;
}

/**
 * Defines an interaction between particles. It allows the usage of a particle method with custom args
 */
export interface Interaction<ParticleType = unknown, ParticleArgs = unknown[]> {
  upon?: string;
  use: Particle<ParticleType> | Notation | QuantumPointer;
  call: string;
  with?: ParticleArgs;
  /**
   * A callback that will be invoked after particle interaction and receive it's result
   */
  then?: <T>(result: T) => void;
}

export type Then = <ParticleType>(particle: ParticleType) => void;
