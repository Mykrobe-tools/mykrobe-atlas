/* @flow */

import { all, fork, put, take, select } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { getLocation, LOCATION_CHANGE } from 'connected-react-router';
import { createSelector } from 'reselect';
import _get from 'lodash.get';

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

export const getExperimentsTreeNewick = createSelector(
  getExperimentsTree,
  experimentsTree => _get(experimentsTree, 'tree')
);

export {
  requestExperimentsTree,
  getExperimentsTree,
  getError,
  getIsFetching,
  experimentsTreeEntitySaga,
};

export default reducer;

// Fetch tree, if not already loaded, when user navigates to an experiment

let treeLoaded = false;

function* experimentsTreeWatcher() {
  yield fork(experimentsTreeWorker);
  while (!treeLoaded) {
    yield take(LOCATION_CHANGE);
    yield fork(experimentsTreeWorker);
  }
}

function* experimentsTreeWorker() {
  if (treeLoaded) {
    return;
  }
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

export function* experimentsTreeSaga(): Saga {
  yield all([fork(experimentsTreeEntitySaga), fork(experimentsTreeWatcher)]);
}
