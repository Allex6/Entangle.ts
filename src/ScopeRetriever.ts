import { HiggsField } from './HiggsField';
import { Particle } from './types/Utils.types';

export class ScopeRetriever {
  constructor(
    private readonly particleClass: Particle,
    private readonly scope: HiggsField
  ) {}

  static create(particleClass: Particle, scope: HiggsField): ScopeRetriever {
    return new ScopeRetriever(particleClass, scope);
  }

  public get() {
    return this.scope.get(this.particleClass);
  }
}
