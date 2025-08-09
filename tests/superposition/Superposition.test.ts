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
import { Interaction } from '../../src/shared/types/Interactions.types';
import { QuantumPointer } from '../../src/quantum-pointer/QuantumPointer';

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
      const EVENT = faker.lorem.word();
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
      const EVENT = faker.lorem.word();
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
      const EVENT = faker.lorem.word();
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

    it('should allow to define interaction properties', () => {
      const EVENT = faker.lorem.word();
      const contract = superposition.upon(EVENT).use(SampleParticle);

      expect(contract).toHaveProperty('call');
      expect(contract).toHaveProperty('with');
      expect(contract).toHaveProperty('emit');
      expect(contract).toHaveProperty('requirements');
      expect(contract).toHaveProperty('once');
      expect(contract).toHaveProperty('entanglement');
      expect(contract).toHaveProperty('catch');
      expect(contract).toHaveProperty('then');
    });

    it('should throw an error if required properties are not defined', () => {
      expect(() =>
        superposition.upon(faker.company.name()).use(SampleParticle).then()
      ).toThrowError(
        'Invalid interaction provided. You must call "use", "call" and "entanglement" methods before calling "then"'
      );
    });

    it('should correctly create a new interaction contract if only required properties are provided', () => {
      const EVENT = faker.lorem.word();
      const ENTANGLEMENT = faker.string.uuid();
      const addInteractionSpy = vi.spyOn(superposition, 'addInteraction');

      superposition.upon(EVENT).use(SampleParticle).call('hi').entanglement(ENTANGLEMENT).then();

      expect(addInteractionSpy).toHaveBeenCalled();
      expect(addInteractionSpy).toHaveBeenCalledWith({
        upon: EVENT,
        use: SampleParticle,
        call: 'hi',
        entanglement: ENTANGLEMENT,
      });
    });

    it('should correctly create a new interaction contract with variations of properties', () => {
      // Spies
      const addInteractionSpy = vi.spyOn(superposition, 'addInteraction');
      const aetherOnSpy = vi.spyOn(aether, 'on');
      const aetherOnceSpy = vi.spyOn(aether, 'once');

      // Requirements
      const EVENT = faker.lorem.word();
      const entanglement = faker.string.uuid();

      // Variations and random data
      const ONCE = faker.datatype.boolean() ? faker.datatype.boolean() : undefined;
      const EMIT = faker.datatype.boolean() ? faker.lorem.word() : undefined;
      const CATCH = faker.datatype.boolean() ? new ConsoleErrorHandler() : undefined;
      const withArgs = faker.datatype.boolean() ? faker.person.firstName() : undefined;
      const requirements = faker.datatype.boolean()
        ? [faker.lorem.word(), faker.lorem.word()]
        : undefined;

      const builder = superposition
        .upon(EVENT)
        .use(SampleParticle)
        .call('hi')
        .entanglement(entanglement);
      const expectedContract: Partial<Interaction<SampleParticle, [string]>> = {
        use: SampleParticle,
        entanglement,
        upon: EVENT,
        call: 'hi',
      };

      if (ONCE) {
        builder.once();
        expectedContract.once = true;
      }

      if (EMIT) {
        builder.emit(EMIT);
        expectedContract.emit = EMIT;
      }

      if (CATCH) {
        builder.catch(CATCH);
        expectedContract.errorHandler = CATCH;
      }

      if (withArgs) {
        builder.with(withArgs);
        expectedContract.with = [withArgs];
      }

      if (requirements) {
        builder.requirements(requirements);
        expectedContract.requirements = requirements;
      }

      builder.then();

      expect(superposition.interactions).toHaveLength(1);
      expect(addInteractionSpy).toHaveBeenCalled();
      expect(addInteractionSpy).toHaveBeenCalledWith(expectedContract);

      if (ONCE) {
        expect(aetherOnceSpy).toHaveBeenCalled();
        expect(aetherOnceSpy).toHaveBeenCalledWith(EVENT, expect.any(Function));
      } else {
        expect(aetherOnSpy).toHaveBeenCalled();
        expect(aetherOnSpy).toHaveBeenCalledWith(EVENT, expect.any(Function));
      }
    });

    it('should correctly create a new interaction contract with every property', () => {
      // Spies
      const addInteractionSpy = vi.spyOn(superposition, 'addInteraction');
      const aetherOnceSpy = vi.spyOn(aether, 'once');

      // Requirements
      const EVENT = faker.lorem.word();
      const entanglement = faker.string.uuid();

      // Variations and random data
      const EMIT = faker.lorem.word();
      const WITH_ARGS = faker.person.firstName();
      const CATCH = new ConsoleErrorHandler();
      const requirements = [faker.lorem.word(), faker.lorem.word()];

      superposition
        .upon(EVENT)
        .use(SampleParticle)
        .call('hi')
        .with(WITH_ARGS)
        .entanglement(entanglement)
        .emit(EMIT)
        .once()
        .catch(CATCH)
        .requirements(requirements)
        .then();

      const expectedContract: Partial<Interaction<SampleParticle, [string]>> = {
        use: SampleParticle,
        entanglement,
        upon: EVENT,
        call: 'hi',
        with: [WITH_ARGS],
        emit: EMIT,
        once: true,
        requirements,
        errorHandler: CATCH,
      };

      expect(superposition.interactions).toHaveLength(1);
      expect(addInteractionSpy).toHaveBeenCalled();
      expect(addInteractionSpy).toHaveBeenCalledWith(expectedContract);
      expect(aetherOnceSpy).toHaveBeenCalled();
      expect(aetherOnceSpy).toHaveBeenCalledWith(EVENT, expect.any(Function));
    });
  });

  it('should correctly build and register a particle on the main scope', () => {
    // Spies
    const higgsSpy = vi.spyOn(higgs, 'register');

    // Requirements
    const EVENT = faker.lorem.word();
    const entanglement = faker.string.uuid();

    // Variations and random data
    const mockedName = faker.person.firstName();

    superposition
      .upon(EVENT)
      .build(SampleParticle)
      .using(mockedName)
      .entanglement(entanglement)
      .then();
    aether.emit(EVENT, entanglement);

    const callback = higgsSpy.mock.calls[0][1];
    const resultingParticle = callback();

    expect(higgsSpy).toHaveBeenCalled();
    expect(higgsSpy).toHaveBeenCalledWith(SampleParticle, expect.any(Function), {
      destroyOnInteraction: undefined,
      lifecycle: undefined,
    });
    expect(resultingParticle).toBeInstanceOf(SampleParticle);
  });

  it('should correctly build and register a particle on a specific scope', () => {
    const scope = higgs.createScope();

    // Spies
    const scopeSpy = vi.spyOn(scope, 'register');
    const higgsSpy = vi.spyOn(higgs, 'register');

    // Requirements
    const EVENT = faker.lorem.word();
    const entanglement = faker.string.uuid();

    // Variations and random data
    const mockedName = faker.person.firstName();

    superposition
      .upon(EVENT)
      .build(SampleParticle)
      .using(mockedName)
      .entanglement(entanglement)
      .inScope(scope)
      .then();
    aether.emit(EVENT, entanglement);

    const callback = scopeSpy.mock.calls[0][1];
    const resultingParticle = callback();

    expect(higgsSpy).not.toHaveBeenCalled();
    expect(scopeSpy).toHaveBeenCalled();
    expect(scopeSpy).toHaveBeenCalledWith(SampleParticle, expect.any(Function), {
      destroyOnInteraction: undefined,
      lifecycle: undefined,
    });
    expect(resultingParticle).toBeInstanceOf(SampleParticle);
  });

  it('should not create a particle if the requirements are not satisfied', () => {
    // Spies
    const higgsSpy = vi.spyOn(higgs, 'register');

    // Requirements
    const EVENT = faker.lorem.word();
    const ANOTHER_EVENT = faker.lorem.word();
    const entanglement = faker.string.uuid();

    // Variations and random data
    const mockedName = faker.person.firstName();

    superposition
      .upon(EVENT)
      .build(SampleParticle)
      .using(mockedName)
      .entanglement(entanglement)
      .requirements([ANOTHER_EVENT])
      .then();
    aether.emit(EVENT, entanglement);

    expect(higgsSpy).not.toHaveBeenCalled();
  });

  it('should handle the interaction between particles', () => {
    // Requirements
    const EVENT = faker.lorem.word();
    const ANOTHER_EVENT = faker.lorem.word();
    const entanglement = faker.string.uuid();

    // Variations and random data
    const mockedName = faker.person.firstName();
    const anotherMockedName = faker.person.firstName();

    superposition
      .upon(EVENT)
      .build(SampleParticle)
      .using(mockedName)
      .entanglement(entanglement)
      .then();

    superposition
      .upon(ANOTHER_EVENT)
      .use(QuantumPointer.create(SampleParticle, higgs))
      .call('hi')
      .entanglement(entanglement)
      .with(anotherMockedName)
      .then();

    aether.emit(EVENT, entanglement);

    // Spies
    const sampleParticle = higgs.get(SampleParticle);
    const sampleParticleSpy = vi.spyOn(sampleParticle, 'hi');

    aether.emit(ANOTHER_EVENT, entanglement);

    expect(sampleParticleSpy).toHaveBeenCalled();
    expect(sampleParticleSpy).toHaveBeenCalledWith(anotherMockedName);
  });

  it('should ignore events with different entanglements', () => {
    // Spies
    const higgsSpy = vi.spyOn(higgs, 'register');

    // Requirements
    const EVENT = faker.lorem.word();
    const entanglement = faker.string.uuid();
    const anotherEntanglement = faker.string.uuid();

    // Variations and random data
    const mockedName = faker.person.firstName();

    superposition
      .upon(EVENT)
      .build(SampleParticle)
      .using(mockedName)
      .entanglement(anotherEntanglement)
      .then();

    aether.emit(EVENT, entanglement);

    expect(higgsSpy).not.toHaveBeenCalled();
  });
});

class SampleParticle {
  constructor(private readonly name: string) {}

  hi(customName?: string) {
    console.log(`Hi, my name is ${customName ?? this.name}`);
  }
}
