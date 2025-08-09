import { describe, expect, it } from 'vitest';
import { QuantumPointer } from '../../src/quantum-pointer/QuantumPointer';
import { HiggsField } from '../../src/higgs-field/HiggsField';

class SampleParticle {
  constructor(private readonly name: string) {}
}

describe('QuantumPointer', () => {
  describe('create', () => {
    it('should return a lazy reference of a Particle', () => {
      expect(
        QuantumPointer.create<SampleParticle, [string]>(SampleParticle, new HiggsField())
      ).toBeInstanceOf(QuantumPointer);
    });
  });

  describe('get', () => {
    it('should return an instance of the Particle from the correct HiggsField', () => {
      const higgs = new HiggsField();
      const pointer = QuantumPointer.create(SampleParticle, higgs);

      higgs.register(SampleParticle, () => new SampleParticle('test'));
      expect(pointer.get()).toBeInstanceOf(SampleParticle);
    });
  });
});
