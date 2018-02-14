/* @flow */

import { combineReducers } from 'redux';
import notifications from './notifications';

export {
  NotificationCategories,
  getNotifications,
  showNotification,
  hideNotification,
  hideAllNotifications,
} from './notifications';

const reducer = combineReducers({
  notifications,
});

export default reducer;
