/* @flow */

import { all, fork, put, takeEvery } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';

import { SET, RESET } from 'makeandship-js-common/src/modules/generic/actions';

import { experimentsFiltersActionType } from './experimentsFilters';
import { requestExperimentsChoices } from './experimentsChoices';
import { requestExperiments } from './experiments';

// Fetch choices and experiments when filters change

function* experimentsFiltersChoicesWater() {
  yield takeEvery(
    [experimentsFiltersActionType(SET), experimentsFiltersActionType(RESET)],
    function*() {
      yield put(requestExperiments());
      yield put(requestExperimentsChoices());
    }
  );
}

export function* experimentsFiltersChoicesSaga(): Saga {
  yield all([fork(experimentsFiltersChoicesWater)]);
}
