/* @flow */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import {
  all,
  call,
  put,
  fork,
  take,
  takeEvery,
  takeLeading,
} from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import axios from 'axios';
import Keycloak from 'keycloak-js';

import { restartSagaOnError } from 'makeandship-js-common/src/modules/utils';
import {
  reducer as auth,
  saga as authSaga,
  setConfig as setAuthConfig,
  actions as authActions,
} from 'makeandship-js-common/src/modules/auth';

import api, {
  rootApiSaga,
  setConfig as setApiConfig,
  jsonApiActions,
} from 'makeandship-js-common/src/modules/api';
import form from 'makeandship-js-common/src/modules/form';

import { createAxiosFetcher } from 'makeandship-js-common/src/modules/fetchers/axiosFetcher';
import jsendResponseTransformer from 'makeandship-js-common/src/modules/transformers/jsendResponseTransformer';
import { createAxiosAuthInterceptor } from 'makeandship-js-common/src/modules/auth/interceptors/axiosAuthInterceptor';
import { createKeycloakProvider } from 'makeandship-js-common/src/modules/auth/providers/keycloakProvider';

import experiments, { rootExperimentsSaga } from './experiments';
import organisations, { rootOrganisationsSaga } from './organisations';
import users, { rootUsersSaga } from './users';
import upload, { rootUploadSaga } from './upload';
import notifications, {
  rootNotificationsSaga,
  showNotification,
  NotificationCategories,
} from './notifications';
import { rootNavigationSaga } from './navigation';
import networkStatus, { networkStatusSaga } from './networkStatus';

const axiosInstance = axios.create({
  baseURL: window.env.REACT_APP_API_URL,
  transformResponse: [jsendResponseTransformer],
});

if (process.env.NODE_ENV !== 'production') {
  // log network requests as curl to help with debugging
  const curlirize = require('axios-curlirize/dist/curlirize').default;
  curlirize(axiosInstance);
}

const keycloakInstance = new Keycloak({
  url: window.env.REACT_APP_KEYCLOAK_URL,
  realm: window.env.REACT_APP_KEYCLOAK_REALM,
  clientId: window.env.REACT_APP_KEYCLOAK_CLIENT_ID,
});

const provider = createKeycloakProvider(keycloakInstance);
const authInterceptor = createAxiosAuthInterceptor(provider);
axiosInstance.interceptors.request.use(authInterceptor);

const fetcher = createAxiosFetcher(axiosInstance);

setAuthConfig({
  provider,
});

setApiConfig({
  fetcher,
  apiUrl: window.env.REACT_APP_API_URL,
  apiSpecUrl: window.env.REACT_APP_API_SPEC_URL,
});

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
  authSaga,
  rootApiSaga,
  rootNotificationsSaga,
  rootUsersSaga,
  rootUploadSaga,
  rootOrganisationsSaga,
  networkStatusSaga,
  rootNavigationSaga,
  rootExperimentsSaga,
];

export function* startSagas(sagas: Array<Saga>): Saga {
  if (process.env.NODE_ENV !== 'development') {
    yield all(sagas.map(restartSagaOnError).map((saga) => call(saga)));
  } else {
    yield all(sagas.map((saga) => fork(saga)));
  }
}

export function* rootSaga(): Saga {
  // if auth token refresh fails, invoke login
  yield takeLeading(authActions.updateTokenError, function* () {
    yield call(provider.login);
  });
  // display api errors as notifications
  yield takeEvery(jsonApiActions.error, function* (action) {
    const content = action.payload?.message;
    if (content) {
      yield put(
        showNotification({
          category: NotificationCategories.ERROR,
          content,
        })
      );
    }
  });
  // start the  sagas
  yield fork(startSagas, sagas);
  // initialise auth with options
  yield put(
    authActions.initialise({
      onLoad: 'check-sso',
    })
  );
  // wait for auth intialisation
  yield take(authActions.initialiseSuccess);
}
