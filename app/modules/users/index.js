/* @flow */

import { all, fork } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import currentUser, { currentUserSaga } from './currentUser';
import currentUserAvatar, { currentUserAvatarSaga } from './currentUserAvatar';
import users, { usersSaga } from './users';
import user, { userSaga } from './user';

export {
  createCurrentUser,
  requestCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  getCurrentUser,
  getCurrentUserRole,
  getIsFetching as getCurrentUserIsFetching,
  getError as getCurrentUserError,
} from './currentUser';

export {
  createCurrentUserAvatar,
  requestCurrentUserAvatar,
  updateCurrentUserAvatar,
  deleteCurrentUserAvatar,
  getCurrentUserAvatar,
  getIsFetching as getCurrentUserAvatarIsFetching,
  getError as getCurrentUserAvatarError,
} from './currentUserAvatar';

export {
  newUser,
  createUser,
  requestUser,
  updateUser,
  deleteUser,
  getUser,
  getIsFetching as getUserIsFetching,
  getError as getUserError,
} from './user';

export {
  requestUsers,
  getUsers,
  getIsFetching as getUsersIsFetching,
  getError as getUsersError,
} from './users';

const usersReducer = combineReducers({
  currentUserAvatar,
  currentUser,
  users,
  user,
});

export default usersReducer;

export function* rootUsersSaga(): Generator<*, *, *> {
  yield all([
    fork(currentUserAvatarSaga),
    fork(currentUserSaga),
    fork(usersSaga),
    fork(userSaga),
  ]);
}
