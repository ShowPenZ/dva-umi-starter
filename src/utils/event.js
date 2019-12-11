import EventEmitter from 'eventemitter3';

export function createEmitter() {
  return new EventEmitter();
}

export const Emitter = createEmitter();
export default Emitter;
