/* @flow */

import { all, fork, put, take, takeEvery } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';

import { actions as authActions } from 'makeandship-js-common/src/modules/auth';

import { experimentsFiltersActionTypes } from './experimentsFilters';
import { requestExperimentsChoices } from './experimentsChoices';
import { requestExperiments } from './experiments';

// Fetch choices and experiments when filters change

function* experimentsFiltersChoicesWater() {
  yield take(authActions.initialiseSuccess);
  yield takeEvery(
    [experimentsFiltersActionTypes.SET, experimentsFiltersActionTypes.RESET],
    function* () {
      yield put(requestExperiments());
      yield put(requestExperimentsChoices());
    }
  );
}

export function* experimentsFiltersChoicesSaga(): Saga {
  yield all([fork(experimentsFiltersChoicesWater)]);
}
