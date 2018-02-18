/* @flow */

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { routerMiddleware, push } from 'react-router-redux';

import { createBrowserHistory, createHashHistory } from 'history';

import rootReducer from '../modules';

import {
  monitorUpload,
  analyseFile,
  analyseFileCancel,
  analyseRemoteFile,
  fetchExperiment,
  analyseFileNew,
  analyseFileSave,
} from '../modules/analyser';

// TODO: add other action creators

const actionCreators = {
  monitorUpload,
  analyseFile,
  analyseFileCancel,
  analyseRemoteFile,
  fetchExperiment,
  analyseFileNew,
  analyseFileSave,
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
    '../modules',
    () => store.replaceReducer(require('../modules')) // eslint-disable-line global-require
  );
}

export default store;
