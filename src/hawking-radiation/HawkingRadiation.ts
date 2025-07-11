import { QueryBuilder } from '../event-horizon/builders/Query.builder';

/**
 * Represents a lazy pointer to data within the EventHorizon.
 * In our analogy, this is the radiation that "escapes" the horizon,
 * carrying information about a past event.
 */
export class HawkingRadiation<T = unknown> {
  private constructor(private readonly queryBuilder: QueryBuilder) {}

  /**
   * Creates a new pointer to information from the EventHorizon.
   * @param queryBuilder A configured QueryBuilder instance that specifies which data to fetch.
   */
  static from<TData = unknown>(queryBuilder: QueryBuilder): HawkingRadiation<TData> {
    return new HawkingRadiation<TData>(queryBuilder);
  }

  /**
   * Resolves the pointer and retrieves the actual data from the EventHorizon.
   */
  public get(): T | undefined {
    return this.queryBuilder.get<T>();
  }
}
