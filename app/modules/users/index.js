/* @flow */

import { combineReducers } from 'redux';
import users from './users';

export {
  getIsFetching,
  getIsSaving,
  getData,
  getDataById,
  requestAllUsers,
  requestUser,
  createOrUpdateUser,
  createUser,
  updateUser,
  deleteUser,
  assignUserRole,
  newUser,
} from './users';

const reducer = combineReducers({
  users,
});

export default reducer;
