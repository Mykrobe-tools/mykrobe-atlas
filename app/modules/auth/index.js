/* @flow */

import { combineReducers } from 'redux';
import auth from './auth';

export {
  getIsLoading,
  getIsFetching,
  getIsAuthenticated,
  getFailureReason,
  getUser,
  getAuthToken,
  loadAuth,
  signOut,
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
  updateFailureReason,
  deleteFailureReason,
  fetchCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  verify,
} from './auth';

const reducer = combineReducers({
  auth,
});

export default reducer;
