/* @flow */

import { createStore, applyMiddleware, compose as vanillaCompose } from 'redux';

import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import { actionCreators, actionsBlacklist } from './devconfig';
import { history } from './config';

import { rootReducer, rootSaga } from '../modules';

const devToolsPresent =
  window && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function';

let compose;

if (devToolsPresent) {
  compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    actionCreators,
    actionsBlacklist,
  });
} else {
  compose = vanillaCompose;
}

const router = routerMiddleware(history);

const sagaMiddleware = createSagaMiddleware();

const middleware = [thunk, sagaMiddleware, router];

const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: (getState, action) => {
    return actionsBlacklist.indexOf(action.type) === -1;
  },
});
middleware.push(logger);

const enhancer = compose(applyMiddleware(...middleware));

const store = createStore(rootReducer(history), enhancer);

sagaMiddleware.run(rootSaga);

if (module.hot) {
  module.hot.accept(
    '../modules',
    () => store.replaceReducer(require('../modules')) // eslint-disable-line global-require
  );
}

export default store;
