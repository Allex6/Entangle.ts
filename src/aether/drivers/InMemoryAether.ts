import EventEmitter from 'events';
import { Aether } from '../Aether';
import { Callback } from '../../shared/types/Utils.types';
import { Boson, Entanglement } from '../../shared/types/Particles.types';
import { Event } from '../../shared/types/Events.types';

/**
 * An in-memory implementation of the Aether using Node.js's native EventEmitter.
 *
 * This implementation is perfect for development, testing, and simple single-process applications.
 *
 * **Warning:** It is not recommended for horizontally-scaled production environments
 * (e.g., using Node.js 'cluster' module, PM2 cluster mode, or multiple servers).
 * Events are bound to a single process's memory and cannot be shared across different
 * processes or machines. Be aware that using it on a production environment cal also lead to an increase in memory consumption.
 */
export class InMemoryAether extends Aether {
  private readonly _emitter = new EventEmitter();

  public on(event: Event, callback: Callback<[Boson]>): void {
    this._emitter.on(event, callback);
  }

  public once(event: Event, callback: Callback<[Boson]>): void {
    this._emitter.once(event, callback);
  }

  public emit<TArgs extends unknown[]>(
    event: Event,
    entanglement: Entanglement,
    ...args: TArgs
  ): void {
    const boson: Boson = {
      payload: args,
      entanglement,
      timestamp: Date.now(),
    };

    this._emitter.emit(event, boson);
  }
}
