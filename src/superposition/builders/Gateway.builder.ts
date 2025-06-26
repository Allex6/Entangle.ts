import { Target } from '../../shared/types/Interactions.types';
import {
  Particle,
  ParticleProperties,
} from '../../shared/types/Particles.types';
import { Superposition } from '../Superposition';
import { InteractionBuilder } from './Interaction.builder';
import { ParticleContractBuilder } from './Particle.builder';

export class GatewayBuilder {
  private readonly particleContract: Partial<ParticleProperties> = {};

  constructor(
    private readonly parent: Superposition,
    private readonly eventName: string
  ) {}

  public build<TParticle = unknown, TArgs extends unknown[] = unknown[]>(
    particleClass: Particle<TParticle, TArgs>
  ): ParticleContractBuilder<TParticle, TArgs> {
    return new ParticleContractBuilder<TParticle, TArgs>(
      this.parent,
      this.eventName,
      this.particleContract.when,
      this.particleContract.is
    ).build(particleClass);
  }

  public when(notation: string): this {
    this.particleContract.when = notation;
    return this;
  }

  public is(value: any): this {
    this.particleContract.is = value;
    return this;
  }

  public use<TParticle, TArgs extends unknown[]>(
    target: Target<TParticle, TArgs>
  ): InteractionBuilder<TParticle, TArgs> {
    return new InteractionBuilder<TParticle, TArgs>(
      this.parent,
      this.eventName
    ).use(target);
  }
}
