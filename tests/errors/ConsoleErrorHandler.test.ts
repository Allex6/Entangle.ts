import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorContext, ErrorHandler } from '../../src/errors/ErrorHandler';
import { ConsoleErrorHandler } from '../../src/errors/ConsoleErrorHandler';

describe('ConsoleErrorHandler', () => {
  let errorHandler: ConsoleErrorHandler;

  beforeEach(() => {
    errorHandler = new ConsoleErrorHandler();
  });

  it('should be an instance of ErrorHandler', () => {
    expect(errorHandler).toBeInstanceOf(ErrorHandler);
    expect(errorHandler).toHaveProperty('handle');
  });

  it('should handle errors with context', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    const error = new Error();
    const context = {
      event: faker.lorem.word(),
      eventArgs: [],
    };

    errorHandler.handle(error, context as unknown as ErrorContext);

    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      `[Entangle.ts Error] An error occurred for event "${context.event}":`
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(2, error);
  });
});
