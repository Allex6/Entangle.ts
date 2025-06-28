import { Notation } from '../../shared/Notation';
import { CausalityLog } from '../../shared/types/Events.types';

export class QueryBuilder {
  private fromClause?: string;
  private usingClause?: string;
  private argClause?: number;
  private whereClause?: unknown;

  constructor(private readonly causalityLogs: CausalityLog<unknown[]>[]) {}

  /**
   * Filters the search to only include logs from a specific event.
   * If not called, the query will search through all events.
   * @param event The name of the event to filter by.
   */
  public from(event: string): this {
    this.fromClause = event;
    return this;
  }

  /**
   * Specifies a dot-notation path to access nested data within an event's argument.
   * This is necessary when an argument is an object or array.
   * @param notation The dot-notation string (e.g., 'user.profile.name').
   */
  public using(notation?: string): this {
    this.usingClause = notation;
    return this;
  }

  /**
   * Asserts that the final resolved data must be strictly equal to a specific value.
   * If the data does not match, the query continues searching for the next match.
   * @param value The value to assert against the resolved data.
   */
  public where(value: unknown): this {
    this.whereClause = value;
    return this;
  }

  /**
   * The arg number to use when querying data.
   * Eg. If an event `test` generates two arguments, like `{ user: 'John' }` and `{ pass: 123 }`,
   * and we provide the arg number as 0, the query will be run against the first argument `{ user: 'John' }`
   */
  public arg(argNumber?: number): this {
    this.argClause = argNumber;
    return this;
  }

  /**
   * Executes the built query and returns the first result found.
   * The search is performed from the most recent event to the oldest.
   * @template T The expected type of the returned data.
   * @returns The first piece of data that matches all query clauses, or `undefined` if no match is found.
   */
  public get<TArgs = unknown>(): TArgs | undefined {
    // Filter the past events
    const potentialDataPoints = [...this.causalityLogs]
      .reverse()
      .filter((log) => !this.fromClause || log.event === this.fromClause)
      .flatMap((log) =>
        this.argClause !== undefined ? [log.args[this.argClause]] : log.args
      );

    const notationInstance = this.usingClause
      ? Notation.create<TArgs>()
          .index(this.argClause ?? 0)
          .property(this.usingClause as any)
      : null;

    for (const data of potentialDataPoints) {
      if (this.usingClause && (typeof data !== 'object' || data === null)) {
        continue;
      }

      // Parses the data using the Notation utility
      const parsedData = notationInstance
        ? notationInstance.getData(data as any)
        : data;

      if (this.whereClause === undefined || parsedData === this.whereClause) {
        return parsedData as TArgs;
      }
    }

    return undefined;
  }
}
