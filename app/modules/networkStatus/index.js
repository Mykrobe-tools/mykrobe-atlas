/* @flow */

import { combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';

import deviceNetworkStatus, {
  deviceNetworkOffline,
  deviceNetworkOnline,
  deviceNetworkStatusSaga,
} from 'makeandship-js-common/src/modules/networkStatus/deviceNetworkStatus';
import { createBeaconNetworkStatusModule } from 'makeandship-js-common/src/modules/networkStatus/beaconNetworkStatusModule';

import { networkStatusNotificationSaga } from './networkStatusNotification';

const beaconNetworkStatusModule = createBeaconNetworkStatusModule('beacon', {
  typePrefix: 'networkStatus/beaconNetworkStatus/',
  getState: (state: any) => state.networkStatus.beaconNetworkStatus,
  url: `${process.env.API_URL}/health-check`,
});

const {
  reducer: beaconNetworkStatus,
  actions: beaconNetworkStatusActions,
  actionType: beaconNetworkStatusActionType,
  sagas: { beaconNetworkStatusSaga },
} = beaconNetworkStatusModule;

const networkStatus = combineReducers({
  deviceNetworkStatus,
  beaconNetworkStatus,
});

export default networkStatus;

export {
  deviceNetworkOffline,
  deviceNetworkOnline,
  beaconNetworkStatusActions,
  beaconNetworkStatusActionType,
};

// Saga

const sagas = [
  deviceNetworkStatusSaga,
  beaconNetworkStatusSaga,
  networkStatusNotificationSaga,
];

export function* networkStatusSaga(): Saga {
  yield all(sagas.map(saga => fork(saga)));
}
