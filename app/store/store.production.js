/* @flow */

import { createStore, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory, createHashHistory } from 'history';

import { rootReducer, rootSaga } from '../modules';
import { fetchJsonMiddleware } from '../modules/api';

export const history = IS_ELECTRON
  ? createHashHistory()
  : createBrowserHistory();

const router = routerMiddleware(history);

const sagaMiddleware = createSagaMiddleware();

const middleware = [thunk, fetchJsonMiddleware, sagaMiddleware, router];

const enhancer = compose(applyMiddleware(...middleware));

const store = createStore(rootReducer, enhancer);

sagaMiddleware.run(rootSaga);

export default store;
