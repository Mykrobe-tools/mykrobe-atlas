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
  (state, { dismissed, hidden, order, categories, limit }) => ({
    notifications: getFilteredNotifications(state, {
      dismissed,
      hidden,
      order,
      categories,
      limit,
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
  order: 'asc',
};

export default NotificationsContainer;
