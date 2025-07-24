import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { EventHorizon } from '../../src/event-horizon/EventHorizon';
import { QueryBuilder } from '../../src/event-horizon/builders/Query.builder';
import { Notation } from '../../src/shared/Notation';

describe('EventHorizon', () => {
  let horizon: EventHorizon;

  beforeEach(() => {
    horizon = new EventHorizon();
  });

  describe('add', () => {
    it('should add an event to the causality logs', () => {
      const EVENT = faker.lorem.word();
      const args = [{ id: faker.string.uuid(), name: faker.person.firstName() }, null];
      const EVENTS_AMOUNT = 1;

      horizon.add(EVENT, ...args);

      expect(horizon.causalityLogs).toHaveLength(EVENTS_AMOUNT);
      expect(horizon.causalityLogs[0].args).toHaveLength(2);
      expect(horizon.causalityLogs[0].args).toEqual(args);
    });
  });

  describe('query', () => {
    it('should return a new instance of QueryBuilder', () => {
      const query = horizon.query();

      expect(query).toBeInstanceOf(QueryBuilder);
      expect(query).toHaveProperty('from');
      expect(query).toHaveProperty('using');
      expect(query).toHaveProperty('get');
    });

    it('should get data only from specified event', () => {
      const EVENT = faker.lorem.word();
      const ARG = faker.lorem.word();

      horizon.add(EVENT, ARG, faker.lorem.word());
      horizon.add(faker.lorem.word(), faker.lorem.word());

      const result = horizon.query().from(EVENT).using(Notation.create<string[]>().index(0)).get();

      expect(result).toBe(ARG);
    });

    it('should get data from the most recent event', () => {
      const EVENT = faker.lorem.word();
      const ARG = faker.lorem.word();

      horizon.add(faker.lorem.word(), faker.lorem.word());
      horizon.add(faker.lorem.word(), faker.lorem.word());
      horizon.add(EVENT, ARG);

      const result = horizon.query().using(Notation.create<string[]>().index(0)).get();

      expect(result).toBe(ARG);
    });

    it('should get undefined if the specified event is not found', () => {
      const EVENT = faker.lorem.word();
      const ARG = faker.lorem.word();

      horizon.add(EVENT, ARG);

      const result = horizon
        .query()
        .from(faker.lorem.word())
        .using(Notation.create<string[]>().index(0))
        .get();

      expect(result).toBeUndefined();
    });

    it('should throw an error if notation is not set', () => {
      const EVENT = faker.lorem.word();
      const ARG = faker.lorem.word();

      horizon.add(EVENT, ARG);

      expect(() => horizon.query().from(faker.lorem.word()).get()).toThrow();
    });
  });
});
