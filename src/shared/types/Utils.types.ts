import { Particle } from './Particles.types';

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
export type Callable<Args extends any[] = any[], Output = any> = Record<
  string,
  (...args: Args) => Output
>;

/**
 * Represents a buildable object
 */
export type Buildable<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[]
> = new (...args: TArgs) => Particle<TInstance>;
