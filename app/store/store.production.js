/* @flow */

import { createStore, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';

import { rootReducer, rootSaga } from '../modules';

import { history, sagaMiddleware } from './config';

const router = routerMiddleware(history);

const middleware = [thunk, sagaMiddleware, router];

const enhancer = compose(applyMiddleware(...middleware));

const store = createStore(rootReducer(history), enhancer);

sagaMiddleware.run(rootSaga);

export default store;
