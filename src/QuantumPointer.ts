import { HiggsField } from './HiggsField';
import { Particle } from './shared/types/Utils.types';

export class QuantumPointer {
  constructor(
    private readonly particleClass: Particle,
    private readonly scope: HiggsField
  ) {}

  static create(particleClass: Particle, scope: HiggsField): QuantumPointer {
    return new QuantumPointer(particleClass, scope);
  }

  public get() {
    return this.scope.get(this.particleClass);
  }
}
