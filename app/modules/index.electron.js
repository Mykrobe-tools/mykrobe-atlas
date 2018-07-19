/* @flow */

import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { all, fork } from 'redux-saga/effects';

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

// allow uncaught errors to crash, so we get a better stack trace

export function* rootSaga(): Generator<*, *, *> {
  yield all(sagas.map(saga => fork(saga)));
}
