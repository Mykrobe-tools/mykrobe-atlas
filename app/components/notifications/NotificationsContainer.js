/* @flow */

import { connect } from 'react-redux';

import Notifications from './Notifications';

import {
  getFilteredNotifications,
  setNotificationExpanded,
  dismissAllNotifications,
  dismissNotification,
} from '../../modules/notifications';

const withRedux = connect(
  (state, { dismissed, hidden, order, categories, limit, autoHide }) => ({
    notifications: getFilteredNotifications(state, {
      dismissed,
      hidden,
      order,
      categories,
      limit,
      autoHide,
    }),
  }),
  {
    setNotificationExpanded,
    dismissAllNotifications,
    dismissNotification,
  }
);

const NotificationsContainer = withRedux(Notifications);

NotificationsContainer.defaultProps = {
  hidden: true,
  dismissed: true,
  autoHide: true,
  order: 'asc',
};

export default NotificationsContainer;
