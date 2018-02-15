/* @flow */

import { combineReducers } from 'redux';

import analyser from './analyser';
import notifications from './notifications';
import auth from './auth';
import experiments from './experiments';

const reducer = combineReducers({
  analyser,
  notifications,
  auth,
  experiments,
});

export default reducer;
