import { QuantumPointer } from '../../quantum-pointer/QuantumPointer';
import { Notation } from '../../shared/Notation';
import { Particle, ParticleCreation } from '../../shared/types/Particles.types';
import { Superposition } from '../Superposition';
import { InteractionBuilder } from './Interaction.builder';
import { ParticleContractBuilder } from './Particle.builder';

export class GatewayBuilder<TInstance, TArgs extends any[] = any[]> {
  private readonly particleContract: Partial<ParticleCreation> = {};

  constructor(
    private readonly parent: Superposition,
    private readonly eventName: string
  ) {}

  public build(
    particleClass: Particle<TInstance, TArgs>
  ): ParticleContractBuilder<TInstance, TArgs> {
    return new ParticleContractBuilder<TInstance, TArgs>(
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

  public use(
    target: Particle<any> | Notation | QuantumPointer<TInstance, TArgs>
  ): InteractionBuilder<TInstance, TArgs> {
    // Cria o builder específico e já pré-configura o evento 'upon' e o alvo 'use'.
    return new InteractionBuilder(this.parent, this.eventName).use(target);
  }
}
