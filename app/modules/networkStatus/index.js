/* @flow */

import { combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';

import {
  reducer as deviceNetworkStatus,
  saga as deviceNetworkStatusSaga,
} from 'makeandship-js-common/src/modules/networkStatus/deviceNetworkStatus';

import {
  reducer as urlNetworkStatus,
  saga as urlNetworkStatusSaga,
} from './urlNetworkStatus';

import { saga as networkStatusNotificationSaga } from './networkStatusNotification';

const networkStatus = combineReducers({
  deviceNetworkStatus,
  urlNetworkStatus,
});

export default networkStatus;

// Saga

const sagas = [
  deviceNetworkStatusSaga,
  urlNetworkStatusSaga,
  networkStatusNotificationSaga,
];

export function* networkStatusSaga(): Saga {
  yield all(sagas.map((saga) => fork(saga)));
}
