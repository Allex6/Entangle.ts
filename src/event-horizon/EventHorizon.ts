import { CausalityLog, Event } from '../shared/types/Events.types';
import { QueryBuilder } from './builders/Query.builder';

/**
 * The limit from which data cannot escape.
 * It holds a history of all past events and allows the search of it
 */
export class EventHorizon {
  public readonly causalityLogs: CausalityLog<unknown[]>[] = [];

  /**
   * Adds a new event record to the causality log.
   * This method should be called whenever a new event is emitted.
   * @param event The name of the event that occurred.
   * @param args The arguments that were passed when the event was emitted.
   */
  public add<TArgs extends unknown[]>(event: Event, ...args: TArgs): this {
    this.causalityLogs.push({ event, args });
    return this;
  }

  /**
   * Begins a new query of past events.
   * Returns a new QueryBuilder instance, allowing for a safe, chainable,
   * and state-isolated way to search the causality log.
   * @returns A new instance of `QueryBuilder`.
   */
  public query(): QueryBuilder {
    return new QueryBuilder(this.causalityLogs);
  }
}
