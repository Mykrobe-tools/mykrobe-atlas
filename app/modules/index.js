/* @flow */

import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { all, fork } from 'redux-saga/effects';

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
import organisations, { rootOrganisationsSaga } from './organisations';
import phylogeny from './phylogeny';
import users, { rootUsersSaga } from './users';
import { rootUploadSaga } from './upload';

export const rootReducer = combineReducers({
  api,
  auth,
  form,
  users,
  analyser,
  experiments,
  notifications,
  organisations,
  phylogeny,
  routing,
});

const sagas = [
  rootApiSaga,
  rootAuthSaga,
  rootExperimentsSaga,
  rootOrganisationsSaga,
  rootUsersSaga,
  rootNotificationsSaga,
  rootUploadSaga,
];

// allow uncaught errors to crash, so we get a better stack trace

export function* rootSaga(): Generator<*, *, *> {
  yield all(sagas.map(saga => fork(saga)));
}
