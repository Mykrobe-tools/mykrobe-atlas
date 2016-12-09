import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import node from './node';
import analyser from './analyser';
import demo from './demo';
import metadata from './metadata';

const rootReducer = combineReducers({
  node,
  analyser,
  demo,
  metadata,
  routing
});

export default rootReducer;
