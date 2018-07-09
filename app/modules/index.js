/* @flow */

import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { all, spawn, call, fork } from 'redux-saga/effects';

import {
  authReducer as auth,
  rootAuthSaga,
} from 'makeandship-js-common/src/modules/auth';
import notifications, {
  rootNotificationsSaga,
} from 'makeandship-js-common/src/modules/notifications';
import api, { rootApiSaga } from 'makeandship-js-common/src/modules/api';
import form from 'makeandship-js-common/src/modules/form';

import analyser from './analyser';
import experiments, { rootExperimentsSaga } from './experiments';
import metadata from './metadata';
import organisations from './organisations';
import phylogeny from './phylogeny';
import users, { rootUsersSaga } from './users';
import { uploadSaga } from './upload/upload';

export const rootReducer = combineReducers({
  api,
  auth,
  form,
  users,
  analyser,
  experiments,
  metadata,
  notifications,
  organisations,
  phylogeny,
  routing,
});

const handleErrors = saga =>
  function*() {
    // Using spawn (instead of fork) spins up each saga in its own 'process'
    // meaning that an error propagating up through one of sagas, won't bring
    // down the root saga
    yield spawn(function*() {
      try {
        // Try and call the saga. We expect these top level sagas to be
        // blocking and run for the lifetime of the app, so we should never
        // reach the next line after this yield
        yield call(saga);
        console.error(`Unexpected top-level saga termination ${saga.name}`);
      } catch (err) {
        // A top-level saga errored out
        console.error(`Saga error in ${saga.name}. ${err}`);
      }
    });
  };

const sagas = [
  rootApiSaga,
  rootAuthSaga,
  rootExperimentsSaga,
  rootUsersSaga,
  rootNotificationsSaga,
  uploadSaga,
];

export function* rootSaga(): Generator<*, *, *> {
  // yield all(sagas.map(handleErrors).map(saga => call(saga)));
  yield all(sagas.map(saga => fork(saga)));
}
