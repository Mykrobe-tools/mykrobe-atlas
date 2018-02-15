/* @flow */

import { combineReducers } from 'redux';

import analyser from './analyser';
import auth from './auth';
import experiments from './experiments';
import metadata from './metadata';
import notifications from './notifications';
import phylogeny from './phylogeny';

const reducer = combineReducers({
  analyser,
  auth,
  experiments,
  metadata,
  notifications,
  phylogeny,
});

export default reducer;
