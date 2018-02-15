/* @flow */

import { combineReducers } from 'redux';

import analyser from './analyser';
import auth from './auth';
import experiments from './experiments';
import metadata from './metadata';
import notifications from './notifications';

const reducer = combineReducers({
  analyser,
  auth,
  experiments,
  metadata,
  notifications,
});

export default reducer;
