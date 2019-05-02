/* @flow */

import { createBeaconNetworkStatusModule } from 'makeandship-js-common/src/modules/networkStatus/beaconNetworkStatusModule';
import { ensureEnv, env } from 'makeandship-js-common/src/util';

const beaconNetworkStatusModule = createBeaconNetworkStatusModule('beacon', {
  typePrefix: 'networkStatus/beaconNetworkStatus/',
  getState: (state: any) => state.networkStatus.beaconNetworkStatus,
  url: `${ensureEnv(env.API_URL)}/health-check`,
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
