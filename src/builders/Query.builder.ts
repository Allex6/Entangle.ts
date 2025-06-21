import { Notation } from '../shared/Notation';
import { CausalityLog } from '../shared/types/Events.types';

export class QueryBuilder {
  private fromClause?: string;
  private usingClause?: string;
  private argClause?: number;
  private whereClause?: unknown;

  constructor(private readonly causalityLogs: CausalityLog[]) {}

  /**
   * Defines from which event the data should be queried
   */
  public from(event: string): this {
    this.fromClause = event;
    return this;
  }

  /**
   * Defines a notation that should be use to iterate through the data (if any).
   * In order to work properly, the data should be an object
   */
  public using(notation?: string): this {
    this.usingClause = notation;
    return this;
  }

  /**
   * Value to be checked against the data
   */
  public where(value: unknown): this {
    this.whereClause = value;
    return this;
  }

  /**
   * The arg number to use when querying data.
   * Eg. If an event `test` generates two arguments, like `{ user: 'John' }` and `{ pass: 123 }`,
   * and we provide the arg number as 1, the query will be run against the second argument `{ pass: 123 }`
   */
  public arg(argNumber?: number): this {
    this.argClause = argNumber;
    return this;
  }

  /**
   * The method that actually gets the data using the built query
   * @returns The data or `undefined` if it cannot be found
   */
  public get<T>(): T | undefined {
    const potentialDataPoints = [...this.causalityLogs]
      .reverse()
      .filter((log) => !this.fromClause || log.event === this.fromClause)
      .flatMap((log) =>
        this.argClause !== undefined ? [log.args[this.argClause]] : log.args
      );

    for (const data of potentialDataPoints) {
      if (this.usingClause && (typeof data !== 'object' || data === null)) {
        continue;
      }

      const parsedData = this.usingClause
        ? Notation.create(this.usingClause).getData(data)
        : data;

      if (this.whereClause === undefined || parsedData === this.whereClause) {
        return parsedData as T;
      }
    }

    return undefined;
  }
}
