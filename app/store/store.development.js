/* @flow */

import { createStore, applyMiddleware, compose as vanillaCompose } from 'redux';

import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createBrowserHistory';
import { createLogger } from 'redux-logger';

import { SUCCESS } from 'makeandship-js-common/src/modules/generic/actions';
import {
  CHECK,
  COUNT_DOWN_SECONDS,
} from 'makeandship-js-common/src/modules/networkStatus/beaconNetworkStatusModule';

import { rootReducer, rootSaga } from '../modules';
import { beaconNetworkStatusActionType } from '../modules/networkStatus';

import {
  signIn,
  verify,
  setToken,
  clearToken,
} from 'makeandship-js-common/src/modules/auth';
import {
  deleteCurrentUser,
  requestCurrentUser,
  requestUser,
  requestUsers,
} from '../modules/users';
import {
  setFormData,
  clearFormData,
} from 'makeandship-js-common/src/modules/form';

import {
  showNotification,
  UPDATE_NOTIFICATION,
} from '../modules/notifications/notifications';
import {
  RESUMABLE_UPLOAD_PROGRESS,
  COMPUTE_CHECKSUMS_PROGRESS,
} from '../modules/upload';

const devToolsPresent =
  window && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function';

let compose;

if (devToolsPresent) {
  const actionCreators = {
    signIn,
    verify,
    setToken,
    clearToken,
    deleteCurrentUser,
    requestCurrentUser,
    requestUser,
    requestUsers,
    setFormData,
    clearFormData,
    showNotification,
  };
  const actionsBlacklist = [
    RESUMABLE_UPLOAD_PROGRESS,
    COMPUTE_CHECKSUMS_PROGRESS,
    UPDATE_NOTIFICATION,
    beaconNetworkStatusActionType(CHECK),
    beaconNetworkStatusActionType(CHECK, SUCCESS),
    beaconNetworkStatusActionType(CHECK, COUNT_DOWN_SECONDS),
  ];
  compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    actionCreators,
    actionsBlacklist,
  });
} else {
  compose = vanillaCompose;
}

export const history = createHistory();

const router = routerMiddleware(history);

const sagaMiddleware = createSagaMiddleware();

const middleware = [thunk, sagaMiddleware, router];

const actionsBlacklist = [
  RESUMABLE_UPLOAD_PROGRESS,
  COMPUTE_CHECKSUMS_PROGRESS,
  UPDATE_NOTIFICATION,
  beaconNetworkStatusActionType(CHECK),
  beaconNetworkStatusActionType(CHECK, SUCCESS),
  beaconNetworkStatusActionType(CHECK, COUNT_DOWN_SECONDS),
];
const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: (getState, action) => {
    return actionsBlacklist.indexOf(action.type) === -1;
  },
});
middleware.push(logger);

const enhancer = compose(applyMiddleware(...middleware));

const store = createStore(rootReducer, enhancer);

sagaMiddleware.run(rootSaga);

if (module.hot) {
  module.hot.accept(
    '../modules',
    () => store.replaceReducer(require('../modules')) // eslint-disable-line global-require
  );
}

export default store;
