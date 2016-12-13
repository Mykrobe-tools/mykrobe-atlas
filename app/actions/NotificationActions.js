/* @flow */

import * as ActionTypes from 'constants/ActionTypes';

let nextNotificationId = 0;

export function showNotification({category, content, isFixed}:Object) {
  return (dispatch: Function) => {
    const id = nextNotificationId++;
    dispatch(show(id, category, content, isFixed));
    if (!isFixed) {
      setTimeout(() => {
        dispatch(hide(id))
      }, 5000);
    }
  }
}

export function hideNotification(id: Number) {
  return (dispatch: Function) => {
    dispatch(hide(id));
  }
}

export function hideNotifications() {
  return (dispatch: Function) => {
    dispatch(hideAll());
  }
}

function show(id, category, content, isFixed) {
  return {
    type: ActionTypes.SHOW_NOTIFICATION,
    id,
    category,
    content,
    isFixed
  }
}

function hide(id) {
  return {
    type: ActionTypes.HIDE_NOTIFICATION,
    id
  }
}

function hideAll() {
  return {
    type: ActionTypes.HIDE_NOTIFICATIONS
  }
}
