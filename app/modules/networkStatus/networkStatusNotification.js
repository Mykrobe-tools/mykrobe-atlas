/* @flow */

import { all, fork, put, take, select } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';

import {
  showNotification,
  hideNotification,
  NotificationCategories,
} from '../notifications';

import {
  getInitialised,
  getOnline,
  DEVICE_NETWORK_STATUS_INITIALISED,
  DEVICE_NETWORK_OFFLINE,
  DEVICE_NETWORK_ONLINE,
} from 'makeandship-js-common/src/modules/networkStatus/deviceNetworkStatus';

let _notificationId;

function* deviceNetworkWatcher() {
  // wait for device network status initialisation
  const initialised = yield select(getInitialised);
  if (!initialised) {
    yield take(DEVICE_NETWORK_STATUS_INITIALISED);
  }
  while (true) {
    // check initial status - if not online then show notification immediately
    const online = yield select(getOnline);
    if (online) {
      yield take(DEVICE_NETWORK_OFFLINE);
    }
    const action = showNotification({
      category: NotificationCategories.ERROR,
      content: `No internet connection`,
      autoHide: false,
    });
    _notificationId = action.payload.id;
    yield put(action);
    yield take(DEVICE_NETWORK_ONLINE);
    yield put(hideNotification(_notificationId));
  }
}

export function* networkStatusNotificationSaga(): Saga {
  yield all([fork(deviceNetworkWatcher)]);
}
