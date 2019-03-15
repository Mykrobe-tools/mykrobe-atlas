/* @flow */

import {
  showNotification,
  UPDATE_NOTIFICATION,
} from '../modules/notifications/notifications';

export const actionCreators = {
  showNotification,
};

export const actionsBlacklist = [UPDATE_NOTIFICATION];
