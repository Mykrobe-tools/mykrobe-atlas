/* @flow */

import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { all, call } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';

import { restartSagaOnError } from 'makeandship-js-common/src/modules/util';
import form from 'makeandship-js-common/src/modules/form';

import notifications, { rootNotificationsSaga } from './notifications';

import desktop, { rootDesktopSaga } from './desktop';

// just use the single experiment reducer in desktop, but retain same overall shape
import experiment from './experiments/experiment';
const experiments = combineReducers({
  experiment,
});

export const rootReducer = combineReducers({
  form,
  experiments,
  notifications,
  routing,
  desktop,
});

const sagas = [rootNotificationsSaga, rootDesktopSaga];

export function* rootSaga(): Saga {
  yield all(sagas.map(restartSagaOnError).map(saga => call(saga)));
}
