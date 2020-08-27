/* @flow */

import { createStore, applyMiddleware, compose } from 'redux';
import * as Sentry from '@sentry/react';

import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory, createHashHistory } from 'history';

import { rootReducer, rootSaga } from '../modules';

export const history = IS_ELECTRON
  ? createHashHistory()
  : createBrowserHistory();

export const onError = (error: Error, errorInfo: any) => {
  Sentry.withScope((scope) => {
    scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
};

const router = routerMiddleware(history);

const sagaMiddleware = createSagaMiddleware({ onError });

const middleware = [thunk, sagaMiddleware, router];

const enhancer = compose(applyMiddleware(...middleware));

const store = createStore(rootReducer(history), enhancer);

sagaMiddleware.run(rootSaga);

export default store;
