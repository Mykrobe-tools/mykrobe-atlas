/* @flow */

import { all, fork, put, call, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import type { Saga } from 'redux-saga';
import { createSelector } from 'reselect';
import moment from 'moment';
import uuid from 'uuid';
import _ from 'lodash';

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
  notifications => notifications
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
  Object.keys(notifications).map(id => {
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
  const sorted = _.orderBy(filteredNotifications, 'updated', order);
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
    added = moment(),
    updated = moment(),
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

export default function reducer(
  state: State = initialState,
  action: Object = {}
): State {
  switch (action.type) {
    case SHOW_NOTIFICATION:
    case JS_COMMON_SHOW_NOTIFICATION:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    case UPDATE_NOTIFICATION: {
      if (!state[action.payload.id]) {
        // doesn't exist, so create a new notification
        return {
          ...state,
          [action.payload.id]: action.payload,
        };
      }
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    }
    case HIDE_NOTIFICATION:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          hidden: true,
        },
      };
    case HIDE_ALL_NOTIFICATIONS: {
      const newState = {};
      Object.keys(state).map(id => {
        const notification = state[id];
        notification.hidden = true;
        newState[id] = notification;
      });
      return newState;
    }
    case DISMISS_NOTIFICATION:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          hidden: true,
          dismissed: true,
        },
      };
    case DISMISS_ALL_NOTIFICATIONS: {
      const newState = {};
      Object.keys(state).map(id => {
        const notification = state[id];
        notification.hidden = true;
        notification.dismissed = true;
        newState[id] = notification;
      });
      return newState;
    }

    case SET_NOTIFICATION_EXPANDED:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          expanded: action.payload.expanded,
        },
      };
    case CLEAR_ALL_NOTIFICATIONS:
      return initialState;
    default:
      return state;
  }
}

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
