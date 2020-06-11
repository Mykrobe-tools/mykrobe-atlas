/* @flow */

import { createBeaconNetworkStatusModule } from 'makeandship-js-common/src/modules/networkStatus/beaconNetworkStatusModule';

const beaconNetworkStatusModule = createBeaconNetworkStatusModule('beacon', {
  typePrefix: 'networkStatus/beaconNetworkStatus/',
  getState: (state: any) => state.networkStatus.beaconNetworkStatus,
  url: `${window.env.REACT_APP_API_URL}/health-check`,
});

const {
  reducer: beaconNetworkStatus,
  actions: beaconNetworkStatusActions,
  selectors: {
    getOnline,
    getInitialised,
    getIsCheckingBeacon,
    getCountDownSeconds,
  },
  actionTypes: beaconNetworkStatusActionTypes,
  sagas: { beaconNetworkStatusSaga },
} = beaconNetworkStatusModule;

export default beaconNetworkStatus;

export {
  beaconNetworkStatusActions,
  beaconNetworkStatusActionTypes,
  beaconNetworkStatusSaga,
  getOnline as getBeaconNetworkStatusOnline,
  getInitialised as getBeaconNetworkStatusInitialised,
  getIsCheckingBeacon,
  getCountDownSeconds,
};
