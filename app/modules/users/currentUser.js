/* @flow */

import { all, fork, put, takeEvery, select } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { push } from 'connected-react-router';
import { createSelector } from 'reselect';

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';
import { actions as authActions } from 'makeandship-js-common/src/modules/auth';
import { getIsAuthenticated } from 'makeandship-js-common/src/modules/auth/selectors';
import { waitForChange } from 'makeandship-js-common/src/modules/utils';

import { showNotification } from '../notifications';

const typePrefix = 'users/currentUser/';

export const LOGOUT_CONFIRM = `${typePrefix}LOGOUT_CONFIRM`;
export const LOGOUT_CANCEL = `${typePrefix}LOGOUT_CANCEL`;

// Actions

export const logoutConfirm = () => ({
  type: LOGOUT_CONFIRM,
});

export const logoutCancel = () => ({
  type: LOGOUT_CANCEL,
});

const getRootUrl = () => {
  return window.location.origin
    ? window.location.origin + '/'
    : window.location.protocol + '/' + window.location.host + '/';
};

export const logout = () =>
  authActions.logout({
    redirectUri: getRootUrl(),
  });

// Side effects

export function* logoutConfirmWatcher(): Saga {
  yield takeEvery(LOGOUT_CONFIRM, function* () {
    if (!confirm(`Sign out - are you sure?`)) {
      yield put(logoutCancel());
      return;
    }
    yield put(logout());
  });
}

const module = createEntityModule('currentUser', {
  typePrefix,
  getState: (state) => state.users.currentUser,
  create: {
    operationId: 'usersCreate',
    onSuccess: function* () {
      yield put(push('/auth/registersuccess'));
    },
  },
  request: {
    operationId: 'currentUserGet',
    onFailure: function* () {
      yield put(logout());
      yield put(showNotification('Please sign in again'));
    },
  },
  update: {
    operationId: 'currentUserUpdate',
    onSuccess: function* () {
      yield put(showNotification('Profile updated'));
    },
  },
  delete: {
    operationId: 'currentUserDelete',
    onSuccess: function* () {
      yield put(logout());
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
  (currentUser) => currentUser.role
);

// watch other actions where we want to fetch the current user

function* authInitialiseWatcher() {
  while (true) {
    const isAuthenticated = yield waitForChange(getIsAuthenticated);
    if (isAuthenticated) {
      yield put(showNotification('You are logged in'));
      yield put(requestEntity());
    } else {
      yield put(showNotification('You are signed out'));
      yield put(resetEntity());
    }
  }
}

// TODO: create sagas etc. to update current user profile and avatar together

function* currentUserSaga(): Saga {
  yield all([
    fork(entitySaga),
    fork(authInitialiseWatcher),
    fork(logoutConfirmWatcher),
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
