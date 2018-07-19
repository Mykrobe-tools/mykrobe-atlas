/* @flow */

import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { createSelector } from 'reselect';
import moment from 'moment';
import uuid from 'uuid';
import _ from 'lodash';

export const NotificationCategories = {
  ERROR: 'ERROR',
  MESSAGE: 'MESSAGE',
  SUCCESS: 'SUCCESS',
};

export const typePrefix = 'notifications/notifications/';
export const CLEAR_ALL = `${typePrefix}CLEAR_ALL`;
export const DISMISS = `${typePrefix}DISMISS`;
export const DISMISS_ALL = `${typePrefix}DISMISS_ALL`;
export const HIDE = `${typePrefix}HIDE`;
export const HIDE_ALL = `${typePrefix}HIDE_ALL`;
export const SET_EXPANDED = `${typePrefix}SET_EXPANDED`;
export const SHOW = `${typePrefix}SHOW`;
export const UPDATE = `${typePrefix}UPDATE`;

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
    order = 'asc',
    limit,
  }: {
    categories?: Array<string>,
    dismissed?: boolean,
    hidden?: boolean,
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
    type: SHOW,
    payload: shapeNotification(arg),
  };
};

export const hideNotification = (id: string) => ({
  type: HIDE,
  payload: id,
});

export const hideAllNotifications = () => ({
  type: HIDE_ALL,
});

export const dismissNotification = (id: string) => ({
  type: DISMISS,
  payload: id,
});

export const dismissAllNotifications = () => ({
  type: DISMISS_ALL,
});

export const setNotificationExpanded = (id: string, expanded: boolean) => ({
  type: SET_EXPANDED,
  payload: { id, expanded },
});

export const updateNotification = (id: string, attributes: any) => ({
  type: UPDATE,
  payload: { id, ...attributes },
});

// Reducer

const initialState: State = {};

export default function reducer(
  state: State = initialState,
  action: Object = {}
): State {
  switch (action.type) {
    case SHOW:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    case UPDATE:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    case HIDE:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          hidden: true,
        },
      };
    case HIDE_ALL: {
      const newState = {};
      Object.keys(state).map(id => {
        const notification = state[id];
        notification.hidden = true;
        newState[id] = notification;
      });
      return newState;
    }
    case DISMISS:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          hidden: true,
          dismissed: true,
        },
      };
    case DISMISS_ALL: {
      const newState = {};
      Object.keys(state).map(id => {
        const notification = state[id];
        notification.hidden = true;
        notification.dismissed = true;
        newState[id] = notification;
      });
      return newState;
    }

    case SET_EXPANDED:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          expanded: action.payload.expanded,
        },
      };
    case CLEAR_ALL:
      return initialState;
    default:
      return state;
  }
}

// Side effects

function* showNotificationWatcher() {
  yield takeEvery(SHOW, showNotificationWorker);
}

export function* showNotificationWorker(action: any): Generator<*, *, *> {
  if (action.payload.autoHide) {
    yield call(delay, 2000);
    yield put(hideNotification(action.payload.id));
  }
}

export function* notificationsSaga(): Generator<*, *, *> {
  yield all([fork(showNotificationWatcher)]);
}
