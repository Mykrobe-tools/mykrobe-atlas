/* @flow */

import { channel } from 'redux-saga';
import { all, fork, put, take, race, select } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';

import {
  showNotification,
  updateNotification,
  NotificationCategories,
} from '../notifications';

import {
  getInitialised,
  getOnline,
  DEVICE_NETWORK_STATUS_INITIALISED,
  DEVICE_NETWORK_OFFLINE,
  DEVICE_NETWORK_ONLINE,
} from 'makeandship-js-common/src/modules/networkStatus/deviceNetworkStatus';

import {
  getBeaconNetworkStatusOnline,
  getBeaconNetworkStatusInitialised,
  getCountDownSeconds,
  beaconNetworkStatusActionTypes,
  beaconNetworkStatusActions,
} from './beaconNetworkStatus';

const _interactionChannel = channel();

export function* interactionChannelWatcher(): Saga {
  while (true) {
    const action = yield take(_interactionChannel);
    yield put(action);
  }
}

function* deviceNetworkStatusWatcher() {
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
      content: `Internet connection offline`,
      expanded: true,
      autoHide: false,
    });
    const notificationId = action.payload.id;
    yield put(action);
    yield take(DEVICE_NETWORK_ONLINE);
    yield put(
      updateNotification(notificationId, {
        category: NotificationCategories.SUCCESS,
        content: `Internet connection online`,
        autoHide: true,
      })
    );
  }
}

function* beaconNetworkStatusWatcher() {
  // wait for device network status initialisation
  const initialised = yield select(getBeaconNetworkStatusInitialised);
  if (!initialised) {
    yield take(beaconNetworkStatusActionTypes.NETWORK_STATUS_INITIALISED);
  }
  while (true) {
    // check initial status - if not online then show notification immediately
    const online = yield select(getBeaconNetworkStatusOnline);
    if (online) {
      yield take(beaconNetworkStatusActionTypes.NETWORK_OFFLINE);
    }
    const action = showNotification({
      category: NotificationCategories.ERROR,
      content: `Atlas unreachable`,
      autoHide: false,
      expanded: true,
    });
    const notificationId = action.payload.id;
    yield put(action);
    let offline = true;
    while (offline) {
      const { countdown, online } = yield race({
        countdown: take(
          beaconNetworkStatusActionTypes.CHECK_COUNT_DOWN_SECONDS
        ),
        check: take(beaconNetworkStatusActionTypes.CHECK),
        online: take(beaconNetworkStatusActionTypes.NETWORK_ONLINE),
      });
      if (online) {
        offline = false;
      } else if (countdown) {
        const countDownSeconds = yield select(getCountDownSeconds);
        yield put(
          updateNotification(notificationId, {
            content: `Atlas unreachable - reconnect in ${countDownSeconds} seconds...`,
            actions: [
              {
                title: 'Reconnect now',
                onClick: () => {
                  _interactionChannel.put(
                    beaconNetworkStatusActions.checkBeaconNow()
                  );
                },
              },
            ],
          })
        );
      } else {
        yield put(
          updateNotification(notificationId, {
            content: `Atlas unreachable - reconnecting...`,
            actions: undefined,
          })
        );
      }
    }
    yield put(
      updateNotification(notificationId, {
        category: NotificationCategories.SUCCESS,
        content: `Atlas online`,
        actions: undefined,
        autoHide: true,
      })
    );
  }
}

export function* networkStatusNotificationSaga(): Saga {
  yield all([
    fork(deviceNetworkStatusWatcher),
    fork(beaconNetworkStatusWatcher),
    fork(interactionChannelWatcher),
  ]);
}
