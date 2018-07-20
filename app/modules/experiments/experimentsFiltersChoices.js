/* @flow */

import { all, fork, put, takeEvery } from 'redux-saga/effects';

import { SET } from 'makeandship-js-common/src/modules/generic/actions';

import { experimentsFiltersActionType } from './experimentsFilters';
import { requestExperimentsChoices } from './experimentsChoices';
import { requestExperiments } from './experiments';

// Fetch choices and experiments when filters change

function* experimentsFiltersChoicesWater() {
  yield takeEvery(experimentsFiltersActionType(SET), function*() {
    yield put(requestExperiments());
    yield put(requestExperimentsChoices());
  });
}

export function* experimentsFiltersChoicesSaga(): Generator<*, *, *> {
  yield all([fork(experimentsFiltersChoicesWater)]);
}
