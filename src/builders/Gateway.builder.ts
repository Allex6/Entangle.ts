import { Notation } from '../shared/Notation';
import { QuantumPointer } from '../QuantumPointer';
import { Superposition } from '../Superposition';
import { ParticleCreation } from '../shared/types/Particles.types';
import { Particle } from '../shared/types/Utils.types';
import { InteractionBuilder } from './Interaction.builder';
import { ParticleContractBuilder } from './Particle.builder';

export class GatewayBuilder {
  private readonly particleContract: Partial<ParticleCreation> = {};

  constructor(
    private readonly parent: Superposition,
    private readonly eventName: string
  ) {}

  public build<T>(particleClass: Particle<T>): ParticleContractBuilder {
    return new ParticleContractBuilder(
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
    target: Particle<any> | Notation | QuantumPointer
  ): InteractionBuilder {
    // Cria o builder específico e já pré-configura o evento 'upon' e o alvo 'use'.
    return new InteractionBuilder(this.parent, this.eventName).use(target);
  }
}
