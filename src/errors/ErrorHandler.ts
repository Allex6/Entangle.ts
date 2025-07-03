import { Interaction } from '../shared/types/Interactions.types';
import { ParticleProperties } from '../shared/types/Particles.types';

/**
 * Provides context about the error that occurred, such as the rule
 * that was being executed.
 */
export interface ErrorContext {
  rule: ParticleProperties | Interaction<any, any, any, any>;
  event?: string;
  eventArgs?: unknown[];
}

/**
 * Abstract class that defines the contract for handling errors within the framework.
 * Developers must provide a concrete implementation of this class.
 */
export abstract class ErrorHandler {
  /**
   * This method is called by Superposition whenever an exception is caught.
   * @param error The error object that was caught.
   * @param context Additional context about where and why the error occurred.
   */
  public abstract handle(error: unknown, context: ErrorContext): void;
}
