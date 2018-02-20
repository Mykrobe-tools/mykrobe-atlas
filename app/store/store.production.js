/* @flow */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory, createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { fetchJsonMiddleware } from '../modules/api';
import rootReducer from '../modules';

export const history = IS_ELECTRON
  ? createHashHistory()
  : createBrowserHistory();

const router = routerMiddleware(history);

const enhancer = applyMiddleware(thunk, fetchJsonMiddleware, router);

const store = createStore(rootReducer, enhancer);
export default store;
