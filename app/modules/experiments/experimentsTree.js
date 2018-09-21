/* @flow */

import { all, fork, put, take, select } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';

const module = createEntityModule('experimentsTree', {
  typePrefix: 'experiments/experimentsTree/',
  getState: state => state.experiments.experimentsTree,
  request: {
    operationId: 'experimentsTree',
  },
});

const {
  reducer,
  actions: { requestEntity: requestExperimentsTree },
  selectors: { getEntity: getExperimentsTree, getError, getIsFetching },
  sagas: { entitySaga: experimentsTreeEntitySaga },
} = module;

export {
  requestExperimentsTree,
  getExperimentsTree,
  getError,
  getIsFetching,
  experimentsTreeEntitySaga,
};

export default reducer;

// Fetch tree, if not already loaded, when user navigates to an experiment

export const getLocation = (state: any) => state.routing.location;

function* experimentsTreeWatcher() {
  let treeLoaded = false;
  while (!treeLoaded) {
    yield take(LOCATION_CHANGE);
    const { pathname } = yield select(getLocation);
    // TODO: move route definitions into a common location
    if (pathname.startsWith('/experiments/')) {
      const experimentsTree = yield select(getExperimentsTree);
      const isFetching = yield select(getIsFetching);
      if (!experimentsTree) {
        if (!isFetching) {
          yield put(requestExperimentsTree());
        }
      } else {
        treeLoaded = true;
      }
    }
  }
}

export function* experimentsTreeSaga(): Saga {
  yield all([fork(experimentsTreeEntitySaga), fork(experimentsTreeWatcher)]);
}
