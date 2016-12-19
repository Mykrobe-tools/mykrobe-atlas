/* @flow */

import * as ActionTypes from '../constants/ActionTypes'

let nextNotificationId = 0

export function showNotification ({category, content, autoHide = true}: Object) {
  return (dispatch: Function) => {
    const id = nextNotificationId++
    dispatch(show(id, category, content, autoHide))
    if (autoHide) {
      setTimeout(() => {
        dispatch(hide(id))
      }, 5000)
    }
  }
}

export function hideNotification (id: Number) {
  return (dispatch: Function) => {
    dispatch(hide(id))
  }
}

export function hideAllNotifications () {
  return (dispatch: Function) => {
    dispatch(hideAll())
  }
}

function show (id, category, content, autoHide) {
  return {
    type: ActionTypes.SHOW_NOTIFICATION,
    id,
    category,
    content,
    autoHide
  }
}

function hide (id) {
  return {
    type: ActionTypes.HIDE_NOTIFICATION,
    id
  }
}

function hideAll () {
  return {
    type: ActionTypes.HIDE_ALL_NOTIFICATIONS
  }
}
