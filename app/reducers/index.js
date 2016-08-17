import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import analyser from './analyser';

const rootReducer = combineReducers({
  analyser,
  routing
});

export default rootReducer;
