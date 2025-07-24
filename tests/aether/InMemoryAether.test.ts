import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Aether, InMemoryAether } from '../../src/aether';

describe('InMemoryAether', () => {
  let aether: InMemoryAether;

  beforeEach(() => {
    aether = new InMemoryAether();
  });

  it('should be an instance of Aether and have "on", "emit", and "once" methods', () => {
    expect(aether).toBeInstanceOf(Aether);
    expect(aether).toHaveProperty('on');
    expect(aether).toHaveProperty('once');
    expect(aether).toHaveProperty('emit');
  });

  it('should call a listener every time an event is emitted', () => {
    const EVENT = faker.lorem.word();
    const ENTANGLEMENT = faker.lorem.word();
    const eventData = { id: faker.string.uuid() };
    const spyCallback = vi.fn();
    const EXPECTED_TIMES_CALLED = 2;

    aether.on(EVENT, spyCallback);
    aether.emit(EVENT, ENTANGLEMENT, eventData);
    aether.emit(EVENT, ENTANGLEMENT, eventData);

    expect(spyCallback).toHaveBeenCalledTimes(EXPECTED_TIMES_CALLED);
    expect(spyCallback).toHaveBeenCalledWith({
      payload: [eventData],
      entanglement: ENTANGLEMENT,
      timestamp: expect.any(Number),
    });
  });

  it('should call a single-use listener only once', () => {
    const EVENT = faker.lorem.word();
    const ENTANGLEMENT = faker.lorem.word();
    const eventData = { id: faker.string.uuid() };
    const spyCallback = vi.fn();
    const EXPECTED_TIMES_CALLED = 1;

    aether.once(EVENT, spyCallback);
    aether.emit(EVENT, ENTANGLEMENT, eventData);
    aether.emit(EVENT, ENTANGLEMENT, eventData);

    expect(spyCallback).toHaveBeenCalledTimes(EXPECTED_TIMES_CALLED);
    expect(spyCallback).toHaveBeenCalledWith({
      payload: [eventData],
      entanglement: ENTANGLEMENT,
      timestamp: expect.any(Number),
    });
  });
});
