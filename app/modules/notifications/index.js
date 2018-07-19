/* @flow */

import { combineReducers } from 'redux';
import notifications from './notifications';

export {
  NotificationCategories,
  getNotifications,
  getFilteredNotifications,
  showNotification,
  hideNotification,
  hideAllNotifications,
  dismissNotification,
  dismissAllNotifications,
  clearAllNotifications,
  setNotificationExpanded,
  updateNotification,
  notificationsSaga as rootNotificationsSaga,
} from './notifications';

const reducer = combineReducers({
  notifications,
});

export default reducer;
