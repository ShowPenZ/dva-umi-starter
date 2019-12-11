import Store from 'store';
import { hasValue } from './helper';
import EventEmitter from './event';

export function getFingerPrint(defaultValue = '') {
  const data = Store.get('fp');
  return hasValue(data) ? data : defaultValue;
}

export function setFingerPrint(data) {
  EventEmitter.emit('fingerPrint', data);
  return Store.set('fp', data);
}

export function setToken(data) {
  EventEmitter.emit('token', data);
  return Store.set('token', data);
}

export function getToken(defaultValue = '') {
  const data = Store.get('token');

  return hasValue(data) ? data : defaultValue;
}
