/* @flow */

import { combineReducers } from 'redux';
import auth from './auth';

export {
  getAuth,
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
  requestCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  verify,
} from './auth';

const reducer = combineReducers({
  auth,
});

export default reducer;
