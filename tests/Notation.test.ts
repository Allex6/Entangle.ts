import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { Notation } from '../src/shared/Notation';

interface IFakeData {
  name: string;
  email: string;
  password: string;
}

describe('Notation', () => {
  it('should allow dynamic access into arrays', () => {
    const notation = Notation.create<IFakeData[]>();

    const data: IFakeData[] = [
      {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
      {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    ];

    expect(notation).toBeInstanceOf(Notation);
    expect(notation).toHaveProperty('property');
    expect(notation).toHaveProperty('index');
    expect(notation).toHaveProperty('get');
    expect(notation).toHaveProperty('getData');

    expect(notation.index(0)).toBeDefined();
    expect(notation.index(0).property('name').getData(data)).toBe(data[0].name);
    expect(notation.index(0).property('email').getData(data)).toBe(data[0].email);
    expect(notation.index(0).property('password').getData(data)).toBe(data[0].password);

    expect(notation.index(1)).toBeDefined();
    expect(notation.index(1).property('name').getData(data)).toBe(data[1].name);
    expect(notation.index(1).property('email').getData(data)).toBe(data[1].email);
    expect(notation.index(1).property('password').getData(data)).toBe(data[1].password);
  });

  it('should allow dynamic access into objects', () => {
    const notation = Notation.create<IFakeData>();

    const data: IFakeData = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    expect(notation.property('name').getData(data)).toBe(data.name);
    expect(notation.property('email').getData(data)).toBe(data.email);
    expect(notation.property('password').getData(data)).toBe(data.password);
  });

  it('should return Notation string', () => {
    const notation = Notation.create<IFakeData>();

    const notationString = notation.property('email').get();
    expect(notationString).toBeTypeOf('string');
    expect(notationString).toBeDefined();
    expect(notationString).toBe('email');
  });

  it('should return whole data when there is no notation set', () => {
    const notation = Notation.create<IFakeData>();
    const data: IFakeData = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const result = notation.getData(data);

    expect(result).toEqual(data);
  });
});
