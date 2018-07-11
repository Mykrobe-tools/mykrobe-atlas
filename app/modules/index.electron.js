/* @flow */

import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { all, fork } from 'redux-saga/effects';

import notifications, {
  rootNotificationsSaga,
} from 'makeandship-js-common/src/modules/notifications';
import form from 'makeandship-js-common/src/modules/form';

import desktop, { rootDesktopSaga } from './desktop';
import experiments, { rootExperimentsSaga } from './experiments';

export const rootReducer = combineReducers({
  form,
  experiments,
  notifications,
  routing,
  desktop,
});

const sagas = [rootExperimentsSaga, rootNotificationsSaga, rootDesktopSaga];

// allow uncaught errors to crash, so we get a better stack trace

export function* rootSaga(): Generator<*, *, *> {
  yield all(sagas.map(saga => fork(saga)));
}
