import { Callback } from './types/Utils.types';

/**
 * The medium that allows the interactions between the particles
 */
export abstract class Aether {
  public abstract on(event: string, callback: Callback): void;
  public abstract once(event: string, callback: Callback): void;
  public abstract emit(event: string, ...args: unknown[]): void;
}
