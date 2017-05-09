/* @flow */

import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import auth from './auth';
import users from './users';
import organisations from './organisations';
import node from './node';
import analyser from './analyser';
import metadata from './metadata';
import notifications from './notifications';
import experiments from './experiments';

const rootReducer = combineReducers({
  auth,
  users,
  organisations,
  node,
  analyser,
  metadata,
  notifications,
  experiments,
  routing
});

export default rootReducer;
