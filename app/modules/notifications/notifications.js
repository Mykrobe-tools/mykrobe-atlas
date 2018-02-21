/* @flow */

import { createSelector } from 'reselect';
import uuid from 'uuid';

const MAX_NOTIFICATIONS = 2;

// const initialState = [
//   {
//     category: 'MESSAGE',
//     content: 'This is a test message',
//     autoHide: false
//   }
// ];

export const NotificationCategories = {
  ERROR: 'ERROR',
  MESSAGE: 'MESSAGE',
  SUCCESS: 'SUCCESS',
};

export const typePrefix = 'notifications/notifications/';
export const SHOW = `${typePrefix}SHOW`;
export const HIDE = `${typePrefix}HIDE`;
export const HIDE_ALL = `${typePrefix}HIDE_ALL`;

// Selectors

export const getState = state => state.notifications.notifications;

export const getNotifications = createSelector(
  getState,
  notifications => notifications
);

// Action creators

function show(id, category, content, autoHide) {
  return {
    type: SHOW,
    id,
    category,
    content,
    autoHide,
  };
}

function hide(id) {
  return {
    type: HIDE,
    id,
  };
}

function hideAll() {
  return {
    type: HIDE_ALL,
  };
}

// Reducer

const initialState = [];

export default function reducer(
  state: Array<any> = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case SHOW: {
      const { id, category, content, autoHide } = action;
      let notification = {
        id,
        category,
        content,
        autoHide,
      };
      const newState = [...state];
      while (newState.length >= MAX_NOTIFICATIONS) {
        newState.splice(0, 1);
      }
      return [...newState, notification];
    }
    case HIDE:
      return state.filter(notification => {
        return notification.id !== action.id;
      });
    case HIDE_ALL:
      return initialState;
    default:
      return state;
  }
}

// Side effects

// export function showNotification({
//   category = NotificationCategories.SUCCESS,
//   content,
//   autoHide = true,
// }: Object) {
export function showNotification(notification: Object | string) {
  if (typeof notification === 'string') {
    notification = {
      content: notification,
    };
  }
  const {
    category = NotificationCategories.SUCCESS,
    content,
    autoHide = true,
  } = notification;
  return (dispatch: Function) => {
    const id = uuid.v4();
    dispatch(show(id, category, content, autoHide));
    if (autoHide) {
      setTimeout(() => {
        dispatch(hide(id));
      }, 2000);
    }
  };
}

export function hideNotification(id: string) {
  return (dispatch: Function) => {
    dispatch(hide(id));
  };
}

export function hideAllNotifications() {
  return (dispatch: Function) => {
    dispatch(hideAll());
  };
}
