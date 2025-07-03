import { ErrorContext, ErrorHandler } from './ErrorHandler';

export class ConsoleErrorHandler extends ErrorHandler {
  public handle(error: unknown, context: ErrorContext): void {
    console.error(
      `[Entangle.ts Error] An error occurred for event "${context.event}":`
    );
    console.error(error);
  }
}
