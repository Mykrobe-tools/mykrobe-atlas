/* @flow */

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { browserHistory, hashHistory } from 'react-router-dom';
import { routerMiddleware, push } from 'react-router-redux';
import rootReducer from '../reducers';
import { createBrowserHistory, createHashHistory } from 'history';

import * as AnalyserActions from '../actions/AnalyserActions';

const actionCreators = {
  ...AnalyserActions,
  push,
};

const logger = createLogger({
  level: 'info',
  collapsed: true,
});

export const history = IS_ELECTRON
  ? createHashHistory()
  : createBrowserHistory();

const router = routerMiddleware(history);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionCreators,
    })
  : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk, router, logger));

const store = createStore(rootReducer, enhancer);

if (module.hot) {
  module.hot.accept(
    '../reducers',
    () => store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
  );
}

export default store;
