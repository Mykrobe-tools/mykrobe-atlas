/* @flow */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory, createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';

export const history = IS_ELECTRON
  ? createHashHistory()
  : createBrowserHistory();

const router = routerMiddleware(history);

const enhancer = applyMiddleware(thunk, router);

const store = createStore(rootReducer, enhancer);
export default store;
