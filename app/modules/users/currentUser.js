/* @flow */

import { all, fork, put, takeEvery, select } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { push } from 'react-router-redux';
import { createSelector } from 'reselect';

// import 'event-source-polyfill';

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';
import { getAccessToken } from 'makeandship-js-common/src/modules/auth';
import { buildOptionsWithToken } from 'makeandship-js-common/src/modules/api/jsonApi';
import { API_URL } from 'makeandship-js-common/src/modules/api/constants';
import {
  getIsAuthenticated,
  signOut,
  SIGNIN_SUCCESS,
  SIGNOUT_SUCCESS,
  SESSION_EXPIRED_SUCCESS,
  INITIALISE_SUCCESS,
} from 'makeandship-js-common/src/modules/auth/auth';

import { showNotification } from '../notifications';

const module = createEntityModule('currentUser', {
  typePrefix: 'users/currentUser/',
  getState: state => state.users.currentUser,
  create: {
    operationId: 'usersCreate',
    onSuccess: function*() {
      yield put(push('/auth/signupsuccess'));
    },
  },
  request: {
    operationId: 'currentUserGet',
    onFailure: function*() {
      yield put(signOut());
      yield put(showNotification('Please sign in again'));
    },
  },
  update: {
    operationId: 'currentUserUpdate',
    onSuccess: function*() {
      yield put(showNotification('Profile updated'));
    },
  },
  delete: {
    operationId: 'currentUserDelete',
    onSuccess: function*() {
      yield put(signOut());
      yield put(showNotification('Account deleted'));
    },
  },
});

const {
  reducer,
  actionType,
  actions: {
    newEntity,
    createEntity,
    requestEntity,
    updateEntity,
    deleteEntity,
    resetEntity,
  },
  selectors: { getEntity, getError, getIsFetching },
  sagas: {
    entitySaga,
    createEntityWorker,
    requestEntityWorker,
    updateEntityWorker,
    deleteEntityWorker,
  },
} = module;

export const getCurrentUserRole = createSelector(
  getEntity,
  currentUser => currentUser.role
);

// watch other actions where we want to fetch the current user

function* authInitialiseWatcher() {
  yield takeEvery(INITIALISE_SUCCESS, authInitialiseWorker);
}

function* authInitialiseWorker() {
  const isAuthenticated = yield select(getIsAuthenticated);
  if (isAuthenticated) {
    yield put(requestEntity());
    yield fork(startWatchingCurrentUserEvents);
  }
}

function* authSignInWatcher() {
  yield takeEvery(SIGNIN_SUCCESS, authSignInWorker);
}

function* authSignInWorker() {
  yield fork(requestEntityWorker);
  yield fork(startWatchingCurrentUserEvents);
}

function* authSignOutWatcher() {
  yield takeEvery(
    [SIGNOUT_SUCCESS, SESSION_EXPIRED_SUCCESS],
    authSignOutWorker
  );
}

function* authSignOutWorker() {
  yield put(resetEntity());
  yield fork(stopWatchingCurrentUserEvents);
}

// events

let _eventSource;

function* startWatchingCurrentUserEvents() {
  const accessToken = yield select(getAccessToken);
  const options = buildOptionsWithToken({}, accessToken);

  // TODO contruct this with swagger operation id
  _eventSource = new EventSourcePolyfill(`${API_URL}/user/events`, {
    headers: options.headers,
  });
  _eventSource.onmessage = e => {
    console.log('EventSource message', e);
  };
  _eventSource.onerror = e => {
    console.log('EventSource failed.');
  };
}

function* stopWatchingCurrentUserEvents() {
  _eventSource && _eventSource.close();
  _eventSource = null;
}

// TODO: create sagas etc. to update current user profile and avatar together

function* currentUserSaga(): Saga {
  yield all([
    fork(entitySaga),
    fork(authInitialiseWatcher),
    fork(authSignInWatcher),
    fork(authSignOutWatcher),
  ]);
}

export {
  newEntity as newCurrentUser,
  createEntity as createCurrentUser,
  requestEntity as requestCurrentUser,
  updateEntity as updateCurrentUser,
  deleteEntity as deleteCurrentUser,
  getEntity as getCurrentUser,
  getError,
  getIsFetching,
  currentUserSaga,
  createEntityWorker as createCurrentUserWorker,
  requestEntityWorker as requestCurrentUserWorker,
  updateEntityWorker as updateCurrentUserWorker,
  deleteEntityWorker as deleteCurrentUserWorker,
  actionType as currentUserActionType,
};

export default reducer;
