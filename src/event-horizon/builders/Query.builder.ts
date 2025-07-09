import { Notation } from '../../shared/Notation';
import { CausalityLog, Event } from '../../shared/types/Events.types';

export class QueryBuilder {
  private fromClause?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private notationInstance?: Notation<any, any>;

  constructor(private readonly causalityLogs: CausalityLog<unknown[]>[]) {}

  /**
   * Filters the search to only include logs from a specific event.
   * If not called, the query will search through all events.
   * @param event The name of the event to filter by.
   */
  public from(event: Event): this {
    this.fromClause = event;
    return this;
  }

  /**
   * Specifies a dot-notation path to access nested data within an event's argument.
   * This is necessary when an argument is an object or array.
   * @param notation The dot-notation string (e.g., 'user.profile.name').
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public using(notation?: Notation<any, any>): this {
    this.notationInstance = notation;
    return this;
  }

  /**
   * Executes the built query and returns the first result found.
   * The search is performed from the most recent event to the oldest.
   * @template TData The expected type of the returned data.
   * @returns The first piece of data that matches all query clauses, or `undefined` ONLY if no matching log is found.
   */
  public get<TData = unknown>(): TData | undefined {
    if (!this.notationInstance) {
      throw new Error('Query cannot be executed without a `.using(notation)` clause.');
    }

    const relevantLog = [...this.causalityLogs]
      .reverse()
      .find((log) => !this.fromClause || log.event === this.fromClause);

    if (!relevantLog) {
      return undefined;
    }

    return this.notationInstance.getData(relevantLog.args) as TData;
  }
}
