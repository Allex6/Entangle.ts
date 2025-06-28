/**
 * Represents the unique name of an event that can be propagated through the Aether.
 */
export type Event = string;

/**
 * Represents a record of a past event, linking the event name
 * to the arguments it was emitted with.
 * @template T A tuple type representing the structure of the event's arguments.
 */
export interface CausalityLog<TArgs> {
  /**
   * The name of the event that occurred.
   */
  event: Event;
  /**
   * The arguments that were passed when the event was emitted.
   */
  args: TArgs;
}
