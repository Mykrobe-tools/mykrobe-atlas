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
  selectors as deviceNetworkStatusSelectors,
  actions as deviceNetworkStatusActions,
} from 'makeandship-js-common/src/modules/networkStatus/deviceNetworkStatus';

import {
  actions as urlNetworkStatusActions,
  selectors as urlNetworkStatusSelectors,
} from './urlNetworkStatus';

const _interactionChannel = channel();

export function* interactionChannelWatcher(): Saga {
  while (true) {
    const action = yield take(_interactionChannel);
    yield put(action);
  }
}

function* deviceNetworkStatusWatcher() {
  // wait for device network status initialisation
  const initialised = yield select(deviceNetworkStatusSelectors.getInitialised);
  if (!initialised) {
    yield take(deviceNetworkStatusActions.deviceNetworkStatusInitialised);
  }
  while (true) {
    // check initial status - if not online then show notification immediately
    const online = yield select(deviceNetworkStatusSelectors.getOnline);
    if (online) {
      yield take(deviceNetworkStatusActions.deviceNetworkOffline);
    }
    const action = showNotification({
      category: NotificationCategories.ERROR,
      content: `Internet connection offline`,
      expanded: true,
      autoHide: false,
    });
    const notificationId = action.payload.id;
    yield put(action);
    yield take(deviceNetworkStatusActions.deviceNetworkOnline);
    yield put(
      updateNotification(notificationId, {
        category: NotificationCategories.SUCCESS,
        content: `Internet connection online`,
        autoHide: true,
      })
    );
  }
}

function* urlNetworkStatusWatcher() {
  // wait for device network status initialisation
  const initialised = yield select(urlNetworkStatusSelectors.getInitialised);
  if (!initialised) {
    yield take(urlNetworkStatusActions.networkStatusInitialised);
  }
  while (true) {
    // check initial status - if not online then show notification immediately
    const online = yield select(urlNetworkStatusSelectors.getOnline);
    if (online) {
      yield take(urlNetworkStatusActions.networkOffline);
    }
    const action = showNotification({
      category: NotificationCategories.ERROR,
      content: `Service unreachable`,
      autoHide: false,
      expanded: true,
    });
    const notificationId = action.payload.id;
    yield put(action);
    let offline = true;
    while (offline) {
      const { countdown, online } = yield race({
        countdown: take(urlNetworkStatusActions.setCountDownSeconds),
        check: take(urlNetworkStatusActions.check),
        online: take(urlNetworkStatusActions.networkOnline),
      });
      if (online) {
        offline = false;
      } else if (countdown) {
        const countDownSeconds = yield select(
          urlNetworkStatusSelectors.getCountDownSeconds
        );
        yield put(
          updateNotification(notificationId, {
            content: `Service unreachable - reconnect in ${countDownSeconds} seconds...`,
            actions: [
              {
                title: 'Reconnect now',
                onClick: () => {
                  _interactionChannel.put(urlNetworkStatusActions.checkNow());
                },
              },
            ],
          })
        );
      } else {
        yield put(
          updateNotification(notificationId, {
            content: `Service unreachable - reconnecting...`,
            actions: undefined,
          })
        );
      }
    }
    yield put(
      updateNotification(notificationId, {
        category: NotificationCategories.SUCCESS,
        content: `Service online`,
        actions: undefined,
        autoHide: true,
      })
    );
  }
}

export function* saga(): Saga {
  yield all([
    fork(deviceNetworkStatusWatcher),
    fork(urlNetworkStatusWatcher),
    fork(interactionChannelWatcher),
  ]);
}
