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
