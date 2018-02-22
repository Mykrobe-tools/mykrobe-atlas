/* @flow */

import { combineReducers } from 'redux';
import auth from './auth';

export {
  getAuth,
  getIsLoading,
  getIsFetching,
  getIsAuthenticated,
  getError,
  deleteError,
  getUser,
  getAuthToken,
  loadAuth,
  signOut,
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
  requestCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  verify,
} from './auth';

const reducer = combineReducers({
  auth,
});

export default reducer;
