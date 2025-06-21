import { Event } from '../shared/types/Events.types';
import { Callback } from '../shared/types/Utils.types';

/**
 * For centuries, scientists believed light required a medium to propagate through space,
 * much like sound requires the air. This theoretical, all-pervading substance was named the `Aether`.
 *
 * In our framework, the **`Aether`** is this medium. It is the core component
 * responsible for emitting and listening to events, allowing them to propagate throughout the application.
 */
export abstract class Aether {
  /**
   * Subscribes to an event, executing a callback function each time it is emitted.
   * @param event The name of the event to listen for.
   * @param callback The function to be executed when the event occurs.
   */
  public abstract on(event: Event, callback: Callback): void;
  /**
   * Subscribes to an event for a single execution. The listener is automatically removed after the event occurs once.
   * @param event The name of the event to listen for.
   * @param callback The function to be executed when the event occurs for the first time.
   */
  public abstract once(event: Event, callback: Callback): void;
  /**
   * Emits an event, propagating it through the Aether to all subscribed listeners.
   * @param event The name of the event to emit.
   * @param args The data or arguments to pass to the listeners' callback functions.
   */
  public abstract emit(event: Event, ...args: unknown[]): void;
}
