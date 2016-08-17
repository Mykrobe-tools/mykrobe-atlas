import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import analyser from './analyser';

const rootReducer = combineReducers({
  analyser,
  counter,
  routing
});

export default rootReducer;
