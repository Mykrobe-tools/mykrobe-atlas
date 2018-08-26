/* @flow */

import { put } from 'redux-saga/effects';

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';

import { requestCurrentUser } from './currentUser';
import { showNotification } from '../notifications';

const module = createEntityModule('currentUserAvatar', {
  typePrefix: 'users/currentUserAvatar/',
  getState: state => state.users.currentUserAvatar,
  create: {
    operationId: 'currentUserAvatarCreate',
    onSuccess: function*() {
      yield put(requestCurrentUser());
      yield put(showNotification('Avatar updated'));
    },
  },
  request: {
    operationId: 'currentUserAvatarGet',
  },
  update: {
    operationId: 'currentUserAvatarUpdate',
    onSuccess: function*() {
      yield put(requestCurrentUser());
      yield put(showNotification('Avatar updated'));
    },
  },
  delete: {
    operationId: 'currentUserAvatarDelete',
    onSuccess: function*() {
      yield put(requestCurrentUser());
    },
  },
});

const {
  reducer,
  actionTypes,
  actions: { createEntity, requestEntity, updateEntity, deleteEntity },
  selectors: { getEntity, getError, getIsFetching },
  sagas: { entitySaga },
} = module;

export {
  createEntity as createCurrentUserAvatar,
  requestEntity as requestCurrentUserAvatar,
  updateEntity as updateCurrentUserAvatar,
  deleteEntity as deleteCurrentUserAvatar,
  getEntity as getCurrentUserAvatar,
  getError,
  getIsFetching,
  entitySaga as currentUserAvatarSaga,
  actionTypes as currentUserActionTypes,
};

export default reducer;
