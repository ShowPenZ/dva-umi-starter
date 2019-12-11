import _ from 'lodash';

import { TYPE_SET_LOADING, TYPE_SET_VISIBLE, TYPE_SET_STATE } from '@/redux/types/index';

import { hasArray, hasString, hasPlainObject, flattenObject } from '@/utils/helper';

export function actionCreator(error, namespace, type, payload = {}, meta = {}) {
  return {
    error,
    type: (namespace ? `${namespace}/` : '') + type,
    payload,
    meta,
  };
}

export function getStartAction(namespace, type) {
  return hasString(namespace) ? `${namespace}/${type}/@@start` : `${type}/@@start`;
}

export function getEndAction(namespace, type) {
  return hasString(namespace) ? `${namespace}/${type}/@@end` : `${type}/@@end`;
}

export function generateAction(type) {
  return ({ error, meta, ...others } = {}, namespace) => actionCreator(error, namespace, type, others, meta);
}

const SetStateAction = generateAction(TYPE_SET_STATE);
export function generateSetStateAction(path, namespace) {
  return state => SetStateAction(hasArray(path) || hasString(path) ? _.set({}, path, state) : state, namespace);
}

export function generatePutStateAction(state, depth, namespace) {
  if (!hasPlainObject(state) || depth === 0) {
    return generateSetStateAction('', namespace);
  }

  return _.reduce(
    flattenObject(state, depth),
    (acc, v, k) => {
      if (_.split(k, '.').length === depth) {
        acc[_.camelCase(k)] = generateSetStateAction(k, namespace);
      }
      return acc;
    },
    {}
  );
}

export function generateSelectStateFn(state, depth, namespace) {
  if (!hasPlainObject(state)) {
    return state => _.get(state, `${namespace}`);
  }

  return _.reduce(
    flattenObject(state, depth),
    (acc, v, k) => {
      if (_.split(k, '.').length === depth) {
        acc[_.camelCase(k)] = state => _.get(state, `${namespace}.${k}`);
      }
      return acc;
    },
    {}
  );
}

export function generateActionsByTypes(types) {
  return _.reduce(
    types,
    (acc, value, key) => {
      acc[value] = generateAction(value);
      return acc;
    },
    {}
  );
}

export default {
  [TYPE_SET_STATE]: SetStateAction,
  [TYPE_SET_LOADING]: generateAction(TYPE_SET_LOADING),
  [TYPE_SET_VISIBLE]: generateAction(TYPE_SET_VISIBLE),
};
