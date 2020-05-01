/* @flow */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { all, call } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';

import { restartSagaOnError } from 'makeandship-js-common/src/modules/util';
import {
  authReducer as auth,
  rootAuthSaga,
} from 'makeandship-js-common/src/modules/auth';
import api, { rootApiSaga } from 'makeandship-js-common/src/modules/api';
import form from 'makeandship-js-common/src/modules/form';
import networkStatus, { networkStatusSaga } from './networkStatus';

import experiments, { rootExperimentsSaga } from './experiments';
import organisations, { rootOrganisationsSaga } from './organisations';
import users, { rootUsersSaga } from './users';
import upload, { rootUploadSaga } from './upload';
import notifications, { rootNotificationsSaga } from './notifications';
import { rootNavigationSaga } from './navigation';

export const rootReducer = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    api,
    auth,
    form,
    users,
    experiments,
    notifications,
    organisations,
    upload,
    networkStatus,
  });

const sagas = [
  rootApiSaga,
  rootAuthSaga,
  rootExperimentsSaga,
  rootOrganisationsSaga,
  rootUsersSaga,
  rootNotificationsSaga,
  rootUploadSaga,
  rootNavigationSaga,
  networkStatusSaga,
];

export function* rootSaga(): Saga {
  yield all(sagas.map(restartSagaOnError).map((saga) => call(saga)));
}
