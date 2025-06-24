export interface IErrorHandler {
  handle: (error: Error) => void;
}

export interface ErrorHandlerOptions {
  exitGracefully?: boolean;
}
