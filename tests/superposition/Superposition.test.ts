import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EventHorizon } from '../../src/event-horizon/EventHorizon';
import { HiggsField } from '../../src/higgs-field/HiggsField';
import { InMemoryAether } from '../../src/aether/drivers/InMemoryAether';
import { Superposition } from '../../src/superposition/Superposition';
import { GatewayBuilder } from '../../src/superposition/builders/Gateway.builder';
import { ParticleContractBuilder } from '../../src/superposition/builders/Particle.builder';
import { InteractionBuilder } from '../../src/superposition/builders/Interaction.builder';
import { ConsoleErrorHandler } from '../../src/errors/ConsoleErrorHandler';
import { Notation } from '../../src/shared/Notation';
import { ParticleProperties } from '../../src/shared/types/Particles.types';

describe('Superposition', () => {
  let horizon: EventHorizon;
  let higgs: HiggsField;
  let aether: InMemoryAether;
  let superposition: Superposition;

  beforeEach(() => {
    aether = new InMemoryAether();
    higgs = new HiggsField();
    horizon = new EventHorizon();
    superposition = new Superposition(aether, higgs, horizon);
  });

  it('should return a new instance of GatewayBuilder', () => {
    expect(superposition.upon(faker.lorem.word())).toBeInstanceOf(GatewayBuilder);
  });

  describe('ParticleBuilder', () => {
    it('should return a new instance of ParticleContractBuilder', () => {
      expect(superposition.upon(faker.lorem.word()).build(SampleParticle)).toBeInstanceOf(
        ParticleContractBuilder
      );
    });

    it('should allow to define the particle properties and behavior', () => {
      const EVENT = faker.lorem.word();
      const builder = superposition.upon(EVENT).build(SampleParticle);

      expect(builder).toHaveProperty('inScope');
      expect(builder).toHaveProperty('using');
      expect(builder).toHaveProperty('emit');
      expect(builder).toHaveProperty('requirements');
      expect(builder).toHaveProperty('lifecycle');
      expect(builder).toHaveProperty('destroyOnInteraction');
      expect(builder).toHaveProperty('when');
      expect(builder).toHaveProperty('is');
      expect(builder).toHaveProperty('once');
      expect(builder).toHaveProperty('entanglement');
      expect(builder).toHaveProperty('then');
      expect(builder).toHaveProperty('catch');
    });

    it('should throw an error if required properties are not defined upon creation', () => {
      expect(() =>
        superposition.upon(faker.company.name()).build(SampleParticle).then()
      ).toThrowError('Missing required properties');
    });

    it('should correctly create a new particle with only required properties', () => {
      const addContractSpy = vi.spyOn(superposition, 'addContract');
      const aetherOnSpy = vi.spyOn(aether, 'on');
      const EVENT = faker.person.firstName();
      const entanglement = faker.string.uuid();

      superposition.upon(EVENT).build(SampleParticle).entanglement(entanglement).then();

      expect(superposition.contracts).toHaveLength(1);
      expect(addContractSpy).toHaveBeenCalled();
      expect(addContractSpy).toHaveBeenCalledWith({
        upon: EVENT,
        build: SampleParticle,
        entanglement,
      });
      expect(aetherOnSpy).toHaveBeenCalled();
      expect(aetherOnSpy).toHaveBeenCalledWith(EVENT, expect.any(Function));
    });

    it('should correctly create a new particle with variations of properties', () => {
      // Spies
      const addContractSpy = vi.spyOn(superposition, 'addContract');
      const aetherOnSpy = vi.spyOn(aether, 'on');
      const aetherOnceSpy = vi.spyOn(aether, 'once');

      // Requirements
      const EVENT = faker.person.firstName();
      const entanglement = faker.string.uuid();

      // Variations and random data
      const ONCE = faker.datatype.boolean() ? faker.datatype.boolean() : undefined;
      const DESTROY_ON_INTERACTION = faker.datatype.boolean()
        ? faker.datatype.boolean()
        : undefined;
      const LIFECYCLE = faker.datatype.boolean()
        ? faker.helpers.arrayElement(['singleton', 'transient'])
        : undefined;
      const EMIT = faker.datatype.boolean() ? faker.lorem.word() : undefined;
      const is = faker.datatype.boolean() ? { name: faker.person.firstName() } : undefined;
      const CATCH = faker.datatype.boolean() ? new ConsoleErrorHandler() : undefined;
      const scope = faker.datatype.boolean() ? higgs.createScope() : undefined;
      const using = faker.datatype.boolean() ? faker.person.firstName() : undefined;
      const requirements = faker.datatype.boolean()
        ? [faker.lorem.word(), faker.lorem.word()]
        : undefined;
      const WHEN = faker.datatype.boolean() ? Notation.create().get() : undefined;

      const builder = superposition.upon(EVENT).build(SampleParticle).entanglement(entanglement);
      const expectedContract: Partial<ParticleProperties<SampleParticle, [string]>> = {
        build: SampleParticle,
        entanglement,
        upon: EVENT,
      };

      if (ONCE) {
        builder.once();
        expectedContract.once = true;
      }

      if (DESTROY_ON_INTERACTION) {
        builder.destroyOnInteraction(DESTROY_ON_INTERACTION);
        expectedContract.destroyOnInteraction = true;
      }

      if (LIFECYCLE) {
        builder.lifecycle(LIFECYCLE);
        expectedContract.lifecycle = LIFECYCLE;
      }

      if (EMIT) {
        builder.emit(EMIT);
        expectedContract.emit = EMIT;
      }

      if (is) {
        builder.is(is);
        expectedContract.is = is;
      }

      if (CATCH) {
        builder.catch(CATCH);
        expectedContract.errorHandler = CATCH;
      }

      if (scope) {
        builder.inScope(scope);
        expectedContract.scope = scope;
      }

      if (using) {
        builder.using(using);
        expectedContract.using = [using];
      }

      if (requirements) {
        builder.requirements(requirements);
        expectedContract.requirements = requirements;
      }

      if (typeof WHEN !== 'undefined') {
        builder.when(WHEN);
        expectedContract.when = WHEN;
      }

      builder.then();

      expect(superposition.contracts).toHaveLength(1);
      expect(addContractSpy).toHaveBeenCalled();
      expect(addContractSpy).toHaveBeenCalledWith(expectedContract);

      if (ONCE) {
        expect(aetherOnceSpy).toHaveBeenCalled();
        expect(aetherOnceSpy).toHaveBeenCalledWith(EVENT, expect.any(Function));
      } else {
        expect(aetherOnSpy).toHaveBeenCalled();
        expect(aetherOnSpy).toHaveBeenCalledWith(EVENT, expect.any(Function));
      }
    });

    it('should correctly create a new particle with every property', () => {
      // Spies
      const addContractSpy = vi.spyOn(superposition, 'addContract');
      const aetherOnceSpy = vi.spyOn(aether, 'once');

      // Requirements
      const EVENT = faker.person.firstName();
      const entanglement = faker.string.uuid();

      // Variations and random data
      const LIFECYCLE = faker.helpers.arrayElement(['singleton', 'transient']);
      const EMIT = faker.lorem.word();
      const is = { name: faker.person.firstName() };
      const CATCH = new ConsoleErrorHandler();
      const scope = higgs.createScope();
      const using = faker.person.firstName();
      const requirements = [faker.lorem.word(), faker.lorem.word()];
      const WHEN = Notation.create().get();

      superposition
        .upon(EVENT)
        .build(SampleParticle)
        .entanglement(entanglement)
        .once()
        .destroyOnInteraction(true)
        .lifecycle(LIFECYCLE)
        .emit(EMIT)
        .is(is)
        .catch(CATCH)
        .inScope(scope)
        .requirements(requirements)
        .using(using)
        .when(WHEN)
        .then();

      const expectedContract: Partial<ParticleProperties<SampleParticle, [string]>> = {
        build: SampleParticle,
        entanglement,
        upon: EVENT,
        once: true,
        destroyOnInteraction: true,
        lifecycle: LIFECYCLE,
        emit: EMIT,
        when: WHEN,
        is,
        errorHandler: CATCH,
        scope,
        using: [using],
        requirements,
      };

      expect(superposition.contracts).toHaveLength(1);
      expect(addContractSpy).toHaveBeenCalled();
      expect(addContractSpy).toHaveBeenCalledWith(expectedContract);

      expect(aetherOnceSpy).toHaveBeenCalled();
      expect(aetherOnceSpy).toHaveBeenCalledWith(EVENT, expect.any(Function));
    });
  });

  describe('InteractionBuilder', () => {
    it('should return a new instance of InteractionBuilder', () => {
      expect(superposition.upon(faker.lorem.word()).use(SampleParticle)).toBeInstanceOf(
        InteractionBuilder
      );
    });
  });
});

class SampleParticle {
  constructor(private readonly name: string) {}
}
