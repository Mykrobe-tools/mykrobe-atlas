/* @flow */

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

export default beaconNetworkStatus;

export {
  beaconNetworkStatusActions,
  beaconNetworkStatusActionType,
  beaconNetworkStatusSaga,
};
