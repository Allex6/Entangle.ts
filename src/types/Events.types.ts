/**
 * Defines the schema that describes a past event that has ocurred
 */
export interface CausalityLog<EventArgs = unknown[]> {
  event: string;
  args: EventArgs;
}
