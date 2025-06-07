import EventEmitter from 'events';
import { Aether } from '../Aether';
import { Callback } from '../types/Utils.types';

export class InMemoryAether extends Aether {
  private readonly _emitter = new EventEmitter();

  public on(event: string, callback: Callback): void {
    this._emitter.on(event, callback);
  }
  public once(event: string, callback: Callback): void {
    this._emitter.once(event, callback);
  }
  public emit(event: string, ...args: unknown[]): void {
    this._emitter.emit(event, ...args);
  }
}
