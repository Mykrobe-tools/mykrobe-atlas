/* @flow */

import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import analyser from './analyser';
import auth from './auth';
import experiments from './experiments';
import metadata from './metadata';
import notifications from './notifications';
import organisations from './organisations';
import phylogeny from './phylogeny';
import users from './users';

const reducer = combineReducers({
  analyser,
  auth,
  experiments,
  metadata,
  notifications,
  organisations,
  phylogeny,
  routing,
  users,
});

export default reducer;
