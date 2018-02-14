/* @flow */

import { combineReducers } from 'redux';

import analyser from './analyser';
import notifications from './notifications';
import auth from './auth';

const reducer = combineReducers({
  analyser,
  notifications,
  auth,
});

export default reducer;
