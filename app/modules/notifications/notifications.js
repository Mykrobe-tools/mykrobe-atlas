/* @flow */

import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { createSelector } from 'reselect';
import moment from 'moment';
import uuid from 'uuid';

export const NotificationCategories = {
  ERROR: 'ERROR',
  MESSAGE: 'MESSAGE',
  SUCCESS: 'SUCCESS',
};

export const typePrefix = 'notifications/notifications/';
export const SHOW = `${typePrefix}SHOW`;
export const DISMISS = `${typePrefix}DISMISS`;
export const SET_EXPANDED = `${typePrefix}SET_EXPANDED`;
export const UPDATE = `${typePrefix}UPDATE`;
export const DISMISS_ALL = `${typePrefix}DISMISS_ALL`;
export const CLEAR_ALL = `${typePrefix}CLEAR_ALL`;

// Selectors

export type Notification = {
  id?: string,
  category?: string,
  content: string,
  expanded?: boolean,
  autoDismiss?: boolean,
  dismissed?: boolean,
  actions?: Array<any>,
  added?: string,
  progress?: number,
};

export type State = { [string]: Notification };

export const getState = (state: any): State =>
  state.notifications.notifications;

export const getNotifications = createSelector(
  getState,
  notifications => notifications
);

// Action creators

export const showNotification = (arg: Notification | string) => {
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
    autoDismiss = true,
    dismissed = false,
    actions,
    added = moment(),
    progress,
  } = notification;
  return {
    type: SHOW,
    payload: {
      id,
      category,
      content,
      expanded,
      autoDismiss,
      dismissed,
      actions,
      added,
      progress,
    },
  };
};

export const dismissNotification = (id: string) => ({
  type: DISMISS,
  payload: id,
});

export const setNotificationExpanded = (id: string, expanded: boolean) => ({
  type: SET_EXPANDED,
  payload: { id, expanded },
});

export const updateNotification = (id: string, attributes: any) => ({
  type: UPDATE,
  payload: { id, ...attributes },
});

export const dismissAllNotifications = () => ({
  type: DISMISS_ALL,
});

// Reducer

const initialState: State = {};

export default function reducer(
  state: State = initialState,
  action: Object = {}
): State {
  switch (action.type) {
    case SHOW:
    case UPDATE:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    case DISMISS:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          dismissed: true,
        },
      };
    case DISMISS_ALL: {
      const newState = {};
      Object.keys(state).map(id => {
        const notification = state[id];
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
  if (action.payload.autoDismiss) {
    yield call(delay, 2000);
    yield put(dismissNotification(action.payload.id));
  }
}

export function* notificationsSaga(): Generator<*, *, *> {
  yield all([fork(showNotificationWatcher)]);
}
