import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HiggsField, ParticleOptions } from '../../src/higgs-field/HiggsField';

class SampleParticle {
  handle() {
    console.log('Sample particle handle method');
  }
}

describe('HiggsField', () => {
  let factory = vi.fn(() => new SampleParticle());
  let higgs: HiggsField;

  beforeEach(() => {
    higgs = new HiggsField();
    factory = vi.fn(() => new SampleParticle());
  });

  describe('register', () => {
    it('should allow the registration of a particle', () => {
      expect(higgs).toHaveProperty('register');
      expect(() => higgs.register(SampleParticle, factory)).not.toThrow();
    });

    it('should allow the registration of a singleton particle', () => {
      expect(higgs).toHaveProperty('register');
      expect(() =>
        higgs.register(SampleParticle, factory, { lifecycle: 'singleton' })
      ).not.toThrow();
    });

    it('should allow the registration of a transient particle', () => {
      expect(higgs).toHaveProperty('register');
      expect(() =>
        higgs.register(SampleParticle, factory, { lifecycle: 'transient' })
      ).not.toThrow();
    });

    it('should allow the registration of a particle that should be destroyed upon interaction', () => {
      expect(higgs).toHaveProperty('register');
      expect(() =>
        higgs.register(SampleParticle, factory, {
          destroyOnInteraction: true,
          lifecycle: 'singleton',
        })
      ).not.toThrow();
    });
  });

  describe('get', () => {
    it('should throw an error if particle is not registered', () => {
      expect(() => higgs.get(SampleParticle)).toThrowError(
        `Particle ${SampleParticle.name} is not registered.`
      );
    });

    it('should correctly retrieve a valid particle instance', () => {
      higgs.register(SampleParticle, factory);
      expect(higgs.get(SampleParticle)).toBeInstanceOf(SampleParticle);
    });

    it('should rebuild particle upon retrieve if the particle lifecycle is transient', () => {
      const EXPECTED_REBUILD_TIMES = 5;

      higgs.register(SampleParticle, factory, { lifecycle: 'transient' });

      for (let i = 0; i < EXPECTED_REBUILD_TIMES; i++) {
        higgs.get(SampleParticle);
      }

      expect(factory).toHaveBeenCalledTimes(EXPECTED_REBUILD_TIMES);
    });

    it('should reuse the same particle instance if particle is of type singleton', () => {
      const EXPECTED_REBUILD_TIMES = 1;
      const RETRIEVE_TIMES = 5;

      higgs.register(SampleParticle, factory, { lifecycle: 'singleton' });

      for (let i = 0; i < RETRIEVE_TIMES; i++) {
        higgs.get(SampleParticle);
      }

      expect(factory).toHaveBeenCalledTimes(EXPECTED_REBUILD_TIMES);
    });

    it('should look upon parent universe to find a particle if the bubble universe does not hold it', () => {
      const bubbleUniverse = higgs.createScope();
      // Register the particle on parent universe
      higgs.register(SampleParticle, factory);
      // Attempts to find the particle on bubble universe
      expect(bubbleUniverse.get(SampleParticle)).toBeInstanceOf(SampleParticle);
    });
  });

  describe('destroy', () => {
    it('should destroy a particle and remove it from HiggsField', () => {
      higgs.register(SampleParticle, factory);
      expect(higgs.get(SampleParticle)).toBeInstanceOf(SampleParticle);

      higgs.destroy(SampleParticle);
      expect(() => higgs.get(SampleParticle)).toThrow();
    });
  });

  describe('getParticleOptions', () => {
    it('should get particle options provided upon registration', () => {
      const particleOptions: ParticleOptions = {
        lifecycle: 'singleton',
        destroyOnInteraction: false,
      };

      higgs.register(SampleParticle, factory, particleOptions);
      expect(higgs.getParticleOptions(SampleParticle)).toEqual(particleOptions);
    });
  });

  describe('createScope', () => {
    it('should create a new HiggsField instance', () => {
      expect(higgs.createScope()).toBeInstanceOf(HiggsField);
    });
  });
});
