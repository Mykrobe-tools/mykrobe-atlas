/* @flow */

import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import node from './node';
import analyser from './analyser';
import metadata from './metadata';
import notifications from './notifications';
import experiments from './experiments';

const rootReducer = combineReducers({
  node,
  analyser,
  metadata,
  notifications,
  experiments,
  routing
});

export default rootReducer;
