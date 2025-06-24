import { ErrorHandlerOptions, IErrorHandler } from './types/error.types';

export class ErrorHandler implements IErrorHandler {
  private constructor(private readonly options: ErrorHandlerOptions) {}

  static create(options: ErrorHandlerOptions = { exitGracefully: false }) {
    return new ErrorHandler(options);
  }

  handle(error: unknown) {
    let details = '';

    if (error instanceof Error) {
      details += `${error.message}\n${error.stack}`;
    }

    if (!details) {
      details = JSON.stringify(error);
    }

    console.error(details.trim());
    process.exit(this.options.exitGracefully ? 0 : 1);
  }
}
