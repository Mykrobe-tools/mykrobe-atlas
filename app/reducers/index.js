import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import node from './node';
import analyser from './analyser';

const rootReducer = combineReducers({
  node,
  analyser,
  routing
});

export default rootReducer;
