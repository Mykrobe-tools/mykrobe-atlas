/* @flow */

import { combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';

import deviceNetworkStatus, {
  deviceNetworkOffline,
  deviceNetworkOnline,
  deviceNetworkStatusSaga,
} from 'makeandship-js-common/src/modules/networkStatus/deviceNetworkStatus';
import { createBeaconNetworkStatusModule } from 'makeandship-js-common/src/modules/networkStatus/beaconNetworkStatusModule';

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

const sagas = [deviceNetworkStatusSaga, beaconNetworkStatusSaga];

export function* networkStatusSaga() {
  yield all(sagas.map(saga => fork(saga)));
}
