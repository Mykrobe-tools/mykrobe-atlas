/* @flow */

import { combineReducers } from 'redux';

import analyser from './analyser';
import notifications from './notifications';

const reducer = combineReducers({
  analyser,
  notifications,
});

export default reducer;
