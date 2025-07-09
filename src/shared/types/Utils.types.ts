import { HawkingRadiation } from '../../hawking-radiation/HawkingRadiation';
import { QuantumPointer } from '../../quantum-pointer/QuantumPointer';
import { Notation } from '../Notation';

/**
 * Defines the shape of a generic callback function.
 * @template Args A tuple type for the function's arguments.
 * @template Output The return type of the function (can be a Promise).
 */
export type Callback<Args extends unknown[] = unknown[], Output = void> = (
  ...args: Args
) => Promisable<Output>;

/**
 * Represents a value that can either be of type T or a Promise that resolves to T.
 * This is useful for functions that can operate both synchronously and asynchronously.
 */
export type Promisable<T = void> = T | Promise<T>;

/**
 * Represents a callable mthod from an object
 */
export type Callable<Args extends unknown[] = unknown[], Output = unknown> = Record<
  string,
  (...args: Args) => Output
>;

/**
 * Represents a value that can be provided directly (T) or as a lazy pointer
 * to be resolved at runtime from various sources.
 * @template T The direct type of the value.
 */
export type Resolvable<T> =
  | T
  | QuantumPointer<T, unknown[]>
  | Notation<unknown, T>
  | HawkingRadiation<T>;

/**
 * Maps a tuple of argument types `TArgs` to a new tuple where each
 * element can be its direct type or a `Resolvable` version of it.
 * @template TArgs The original tuple of argument types.
 */
export type ResolvableArgs<TArgs extends unknown[]> = {
  [K in keyof TArgs]: Resolvable<TArgs[K]>;
};

/**
 * A utility type that extracts all keys from an object `T`
 * whose values are functions (methods).
 */
export type MethodKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];
