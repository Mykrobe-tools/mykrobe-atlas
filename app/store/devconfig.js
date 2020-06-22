/* @flow */

import {
  deviceNetworkOffline,
  deviceNetworkOnline,
} from 'makeandship-js-common/src/modules/networkStatus/deviceNetworkStatus';

import {
  beaconNetworkStatusActionTypes,
  beaconNetworkStatusActions,
} from '../modules/networkStatus';

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

import { joinOrganisation } from '../modules/organisations/organisationMembers';

import {
  RESUMABLE_UPLOAD_PROGRESS,
  COMPUTE_CHECKSUMS_PROGRESS,
} from '../modules/upload';

import {
  EVENT,
  UPLOAD_THIRD_PARTY_PROGRESS,
} from '../modules/users/currentUserEvents';

export const actionCreators = {
  joinOrganisation,
  deleteCurrentUser,
  requestCurrentUser,
  requestUser,
  requestUsers,
  setFormData,
  clearFormData,
  showNotification,
  deviceNetworkOffline,
  deviceNetworkOnline,
  beaconNetworkOffline: beaconNetworkStatusActions.beaconNetworkOffline,
  beaconNetworkOnline: beaconNetworkStatusActions.beaconNetworkOnline,
};

export const actionsBlacklist = [
  RESUMABLE_UPLOAD_PROGRESS,
  COMPUTE_CHECKSUMS_PROGRESS,
  UPDATE_NOTIFICATION,
  EVENT,
  UPLOAD_THIRD_PARTY_PROGRESS,
  beaconNetworkStatusActionTypes.CHECK,
  beaconNetworkStatusActionTypes.CHECK_SUCCESS,
  beaconNetworkStatusActionTypes.CHECK_COUNT_DOWN_SECONDS,
];
