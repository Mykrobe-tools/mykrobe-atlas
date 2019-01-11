/* @flow */

import { all, fork, put, takeEvery, select } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { push } from 'react-router-redux';
import { createSelector } from 'reselect';

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';
import {
  getIsAuthenticated,
  signOut as authSignOut,
  SIGNIN_SUCCESS,
  SIGNOUT_SUCCESS,
  SESSION_EXPIRED_SUCCESS,
  INITIALISE_SUCCESS,
} from 'makeandship-js-common/src/modules/auth/auth';

import { showNotification } from '../notifications';

const typePrefix = 'users/currentUser/';

export const SIGN_OUT = `${typePrefix}SIGN_OUT`;
export const SIGN_OUT_CANCEL = `${typePrefix}SIGN_OUT_CANCEL`;

// Actions

export const signOut = () => ({
  type: SIGN_OUT,
});

export const signOutCancel = () => ({
  type: SIGN_OUT_CANCEL,
});

// Side effects

export function* signOutWatcher(): Saga {
  yield takeEvery(SIGN_OUT, function*() {
    if (!confirm(`Sign out - are you sure?`)) {
      yield put(signOutCancel());
      return;
    }
    yield put(authSignOut());
  });
}

const module = createEntityModule('currentUser', {
  typePrefix,
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
      yield put(authSignOut());
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
      yield put(authSignOut());
      yield put(showNotification('Account deleted'));
    },
  },
});

const {
  reducer,
  actionTypes,
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
  }
}

function* authSignInWatcher() {
  yield takeEvery(SIGNIN_SUCCESS, authSignInWorker);
}

function* authSignInWorker() {
  yield put(requestEntity());
}

function* authSignOutWatcher() {
  yield takeEvery(
    [SIGNOUT_SUCCESS, SESSION_EXPIRED_SUCCESS],
    authSignOutWorker
  );
}

function* authSignOutWorker() {
  yield put(resetEntity());
}

// TODO: create sagas etc. to update current user profile and avatar together

function* currentUserSaga(): Saga {
  yield all([
    fork(entitySaga),
    fork(authInitialiseWatcher),
    fork(authSignInWatcher),
    fork(authSignOutWatcher),
    fork(signOutWatcher),
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
  actionTypes as currentUserActionTypes,
};

export default reducer;
