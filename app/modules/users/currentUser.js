/* @flow */

import { all, fork, put, takeEvery, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { createSelector } from 'reselect';

import { showNotification } from 'makeandship-js-common/src/modules/notifications';
import { createEntityModule } from 'makeandship-js-common/src/modules/generic';
import {
  getIsAuthenticated,
  signOut,
  SIGNIN_SUCCESS,
  SIGNOUT_SUCCESS,
  SESSION_EXPIRED_SUCCESS,
  INITIALISE_SUCCESS,
} from 'makeandship-js-common/src/modules/auth/auth';

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
  }
}

function* authSignInWatcher() {
  yield takeEvery(SIGNIN_SUCCESS, requestEntityWorker);
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

function* currentUserSaga(): Generator<*, *, *> {
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
