/**
 * A powerful utility class that encapsulates dot-notation strings (e.g., 'a.b.c')
 * and provides a safe way to retrieve nested values from objects.
 *
 * @example
 * const data = { user: { profile: { name: 'Alex' } } };
 * const notation = Notation.create('user.profile.name');
 * const name = notation.getData(data); // Returns 'Alex'
 */
export class Notation {
  constructor(public readonly _notation: string) {}

  /**
   * Creates a new instance of `Notation`.
   * @param notation The dot-notation string (e.g., 'user.profile.name').
   */
  static create(notation: string): Notation {
    return new Notation(notation);
  }

  /**
   * @returns The raw notation string provided upon creation.
   */
  public get(): string {
    return this._notation;
  }

  /**
   * Safely retrieves a nested value from a data object using the stored notation.
   * @param data The object to retrieve the value from.
   * @returns The resolved value, or `undefined` if any part of the path is not found.
   */
  public getData(data: any): any {
    if (!this._notation) {
      return data;
    }

    const parts = this._notation.split('.');
    let currentValue = data;

    for (const part of parts) {
      if (typeof currentValue !== 'object' || currentValue === null) {
        return undefined;
      }
      currentValue = currentValue[part];
    }

    return currentValue;
  }
}
