export class Notation {
  constructor(public readonly _notation: string) {}

  static create(notation: string) {
    return new Notation(notation);
  }

  public get(): string {
    return this._notation;
  }

  /**
   * Allows the parsing of a notation into data
   * @param data The object
   * @param notation The notation as follows: 'a.b.c'
   */
  getData(data: any): any {
    const parts = this._notation.split('.');

    if (parts.length === 0) {
      throw new Error('Invalid notation!');
    }

    if (typeof data !== 'object') {
      throw new Error('Invalid data!');
    }

    let value = data[parts[0]];

    for (let i = 1; i < parts.length; i++) {
      if (typeof value !== 'object') {
        return undefined;
      }

      value = value[parts[i]];
    }

    return value;
  }
}
