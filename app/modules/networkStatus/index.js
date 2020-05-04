/* @flow */

import { combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';

import deviceNetworkStatus, {
  deviceNetworkOffline,
  deviceNetworkOnline,
  deviceNetworkStatusSaga,
} from 'makeandship-js-common/src/modules/networkStatus/deviceNetworkStatus';

import beaconNetworkStatus, {
  beaconNetworkStatusActions,
  beaconNetworkStatusActionTypes,
  beaconNetworkStatusSaga,
} from './beaconNetworkStatus';

import { networkStatusNotificationSaga } from './networkStatusNotification';

const networkStatus = combineReducers({
  deviceNetworkStatus,
  beaconNetworkStatus,
});

export default networkStatus;

export {
  deviceNetworkOffline,
  deviceNetworkOnline,
  beaconNetworkStatusActions,
  beaconNetworkStatusActionTypes,
};

// Saga

const sagas = [
  deviceNetworkStatusSaga,
  beaconNetworkStatusSaga,
  networkStatusNotificationSaga,
];

export function* networkStatusSaga(): Saga {
  yield all(sagas.map((saga) => fork(saga)));
}
