import _ from 'lodash';
import { NS_INDEX } from '@/redux/namespaces/index';
import { TYPE_SET_STATE } from '@/redux/types/index';
import { generatePutStateAction } from '@/redux/actions/handler';

import { generateSubscriptionByRoutes, mergeObject } from '@/utils/helper';

const InitialState = {
  index: {},
};

const StateAt = generatePutStateAction(InitialState, 1);
// const StateFrom = generateSelectStateFn(InitialState, 0, NS_HOME);

const Routes = {
  '/': {
    onEnter: ({ dispatch }) => {
      console.log('Enter /');

      return;
    },
    onLeave: ({ dispatch }) => {
      return dispatch(StateAt(_.cloneDeep(InitialState)));
    },
  },
};

export default {
  namespace: NS_INDEX,
  state: _.cloneDeep(InitialState),
  subscriptions: {
    setup: generateSubscriptionByRoutes(Routes),
  },
  effects: {
    *loading({ payload }, { call, put, race, select, take }) {
      yield put(StateAt.index({ loading: payload.loading }));
    },
  },
  reducers: {
    [TYPE_SET_STATE](state, { payload }) {
      // mergeObject(state, payload);
      return mergeObject({}, state, payload);
    },
  },
};
