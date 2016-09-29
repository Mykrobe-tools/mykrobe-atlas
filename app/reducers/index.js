import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import node from './node';
import analyser from './analyser';
import demo from './demo';

const rootReducer = combineReducers({
  node,
  analyser,
  demo,
  routing
});

export default rootReducer;
