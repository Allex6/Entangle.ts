import { QueryBuilder } from './builders/Query.builder';
import { CausalityLog } from './shared/types/Events.types';

/**
 * The limit from which data cannot escape. It holds a history of all events ocurred and allows the search of it
 */
export class EventHorizon {
  public readonly causalityLogs: CausalityLog[] = [];

  /**
   * Add data to the Event Horizon so it can be queried later
   * @param event
   * @param args
   * @returns
   */
  public add<EventArgs extends unknown[] = unknown[]>(
    event: string,
    ...args: EventArgs
  ): this {
    this.causalityLogs.push({ event, args });
    return this;
  }

  /**
   * It allows the query of events that has already happened
   */
  public query(): QueryBuilder {
    return new QueryBuilder(this.causalityLogs);
  }
}
