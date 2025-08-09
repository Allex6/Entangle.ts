import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import { HawkingRadiation } from '../../src/hawking-radiation/HawkingRadiation';
import { QueryBuilder } from '../../src/event-horizon/builders/Query.builder';
import { Notation } from '../../src/shared/Notation';
import { CausalityLog } from '../../src/shared/types/Events.types';

interface SampleLog {
  value: number;
}

describe('HawkingRadiation', () => {
  describe('from', () => {
    it('should return a HawkingRadiation instance', () => {
      expect(HawkingRadiation.from(new QueryBuilder([]))).toBeInstanceOf(HawkingRadiation);
    });
  });

  describe('get', () => {
    it('should call get method from the query builder', () => {
      const query = new QueryBuilder([]).using(Notation.create());
      const getSpy = vi.spyOn(query, 'get');
      const hawking = HawkingRadiation.from(query);

      hawking.get();
      expect(getSpy).toHaveBeenCalled();
    });

    it('should correctly get data from the query builder', () => {
      const EVENT = faker.lorem.word();
      const VALUE = faker.number.float();

      const sampleLogs: CausalityLog<[SampleLog]>[] = [
        {
          event: EVENT,
          args: [{ value: VALUE }],
        },
      ];

      const hawking = HawkingRadiation.from(
        new QueryBuilder(sampleLogs)
          .from(EVENT)
          .using(Notation.create<[SampleLog]>().index(0).property('value'))
      );

      const value = hawking.get();
      expect(value).toBe(VALUE);
    });
  });
});
