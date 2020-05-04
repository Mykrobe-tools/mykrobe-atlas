/* @flow */

import { all, fork, put, call, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import type { Saga } from 'redux-saga';
import { createSelector } from 'reselect';
import uuid from 'uuid';
import _orderBy from 'lodash.orderby';
import produce from 'immer';
import * as dateFns from 'date-fns';

import { SHOW as JS_COMMON_SHOW_NOTIFICATION } from 'makeandship-js-common/src/modules/notifications/notifications';

export const NotificationCategories = {
  ERROR: 'ERROR',
  MESSAGE: 'MESSAGE',
  SUCCESS: 'SUCCESS',
};

export const typePrefix = 'notifications/notifications/';
export const CLEAR_ALL_NOTIFICATIONS = `${typePrefix}CLEAR_ALL_NOTIFICATIONS`;
export const DISMISS_NOTIFICATION = `${typePrefix}DISMISS_NOTIFICATION`;
export const DISMISS_ALL_NOTIFICATIONS = `${typePrefix}DISMISS_ALL_NOTIFICATIONS`;
export const HIDE_NOTIFICATION = `${typePrefix}HIDE_NOTIFICATION`;
export const HIDE_ALL_NOTIFICATIONS = `${typePrefix}HIDE_ALL_NOTIFICATIONS`;
export const SET_NOTIFICATION_EXPANDED = `${typePrefix}SET_NOTIFICATION_EXPANDED`;
export const SHOW_NOTIFICATION = `${typePrefix}SHOW_NOTIFICATION`;
export const UPDATE_NOTIFICATION = `${typePrefix}UPDATE_NOTIFICATION`;

// Selectors

export type Notification = {
  id?: string,
  category?: string,
  content: string,
  expanded?: boolean,
  autoHide?: boolean,
  dismissed?: boolean, // user dismissed
  hidden?: boolean, // auto hide
  actions?: Array<any>,
  added?: string,
  updated?: string,
  progress?: number,
};

export type State = { [string]: Notification };

export const getState = (state: any): State =>
  state.notifications.notifications;

export const getNotifications = createSelector(
  getState,
  (notifications) => notifications
);

export const getFilteredNotifications = (
  state: any,
  {
    categories = [
      NotificationCategories.ERROR,
      NotificationCategories.MESSAGE,
      NotificationCategories.SUCCESS,
    ],
    dismissed = true,
    hidden = true,
    autoHide = true,
    order = 'asc',
    limit,
  }: {
    categories?: Array<string>,
    dismissed?: boolean,
    hidden?: boolean,
    autoHide?: boolean,
    order?: string,
    limit?: number,
  }
) => {
  const notifications = getNotifications(state);

  const filteredNotifications = [];
  Object.keys(notifications).map((id) => {
    const notification = notifications[id];
    let keep = true;
    if (notification.dismissed && !dismissed) {
      keep = false;
    }
    if (notification.hidden && !hidden) {
      keep = false;
    }
    if (notification.autoHide && !autoHide) {
      keep = false;
    }
    if (!categories.includes(notification.category)) {
      keep = false;
    }
    if (keep) {
      filteredNotifications.push(notification);
    }
  });
  const sorted = _orderBy(filteredNotifications, 'updated', order);
  return limit && sorted.length > limit ? sorted.slice(0, limit) : sorted;
};

// Action creators

export const shapeNotification = (arg: Notification | string) => {
  let notification: Notification;
  if (typeof arg === 'string') {
    notification = {
      content: arg,
    };
  } else {
    notification = arg;
  }
  const {
    id = uuid.v4(),
    category = NotificationCategories.SUCCESS,
    content,
    expanded = false,
    autoHide = true,
    dismissed = false,
    hidden = false,
    actions,
    added = dateFns.formatISO(new Date()),
    updated = dateFns.formatISO(new Date()),
    progress,
  } = notification;
  return {
    id,
    category,
    content,
    expanded,
    autoHide,
    dismissed,
    hidden,
    actions,
    added,
    updated,
    progress,
  };
};

export const showNotification = (arg: Notification | string) => {
  return {
    type: SHOW_NOTIFICATION,
    payload: shapeNotification(arg),
  };
};

export const hideNotification = (id: string) => ({
  type: HIDE_NOTIFICATION,
  payload: id,
});

export const hideAllNotifications = () => ({
  type: HIDE_ALL_NOTIFICATIONS,
});

export const dismissNotification = (id: string) => ({
  type: DISMISS_NOTIFICATION,
  payload: id,
});

export const dismissAllNotifications = () => ({
  type: DISMISS_ALL_NOTIFICATIONS,
});

export const clearAllNotifications = () => ({
  type: CLEAR_ALL_NOTIFICATIONS,
});

export const setNotificationExpanded = (id: string, expanded: boolean) => ({
  type: SET_NOTIFICATION_EXPANDED,
  payload: { id, expanded },
});

export const updateNotification = (id: string, attributes: any) => ({
  type: UPDATE_NOTIFICATION,
  payload: { id, ...attributes },
});

// Reducer

const initialState: State = {};

const reducer = (state?: State = initialState, action?: Object = {}): State =>
  produce(state, (draft) => {
    switch (action.type) {
      case SHOW_NOTIFICATION:
      case JS_COMMON_SHOW_NOTIFICATION:
        draft[action.payload.id] = action.payload;
        return;
      case UPDATE_NOTIFICATION: {
        if (!draft[action.payload.id]) {
          // doesn't exist, so create a new notification
          draft[action.payload.id] = action.payload;
        }
        Object.assign(draft[action.payload.id], action.payload);
        return;
      }
      case HIDE_NOTIFICATION:
        draft[action.payload].hidden = true;
        return;
      case HIDE_ALL_NOTIFICATIONS: {
        Object.keys(draft).map((id) => {
          draft[id].hidden = true;
        });
        return;
      }
      case DISMISS_NOTIFICATION:
        Object.assign(draft[action.payload], {
          hidden: true,
          dismissed: true,
        });
        return;
      case DISMISS_ALL_NOTIFICATIONS:
        Object.keys(draft).map((id) => {
          draft[id].hidden = true;
          draft[id].dismissed = true;
        });
        return;
      case SET_NOTIFICATION_EXPANDED:
        draft[action.payload.id].expanded = action.payload.expanded;
        return;
      case CLEAR_ALL_NOTIFICATIONS:
        return initialState;
      default:
        return;
    }
  });

export default reducer;

// Side effects

function* showNotificationWatcher() {
  yield takeEvery(
    [JS_COMMON_SHOW_NOTIFICATION, SHOW_NOTIFICATION, UPDATE_NOTIFICATION],
    showNotificationWorker
  );
}

export function* showNotificationWorker(action: any): Saga {
  if (action.payload.autoHide) {
    yield call(delay, 2000);
    yield put(hideNotification(action.payload.id));
  }
}

export function* notificationsSaga(): Saga {
  yield all([fork(showNotificationWatcher)]);
}
