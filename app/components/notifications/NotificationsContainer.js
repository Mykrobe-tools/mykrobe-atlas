/* @flow */

import { connect } from 'react-redux';

import Notifications from './Notifications';

import {
  getNotifications,
  setNotificationExpanded,
  dismissAllNotifications,
  dismissNotification,
} from '../../modules/notifications';

const withRedux = connect(
  state => ({
    notifications: getNotifications(state),
  }),
  {
    setNotificationExpanded,
    dismissAllNotifications,
    dismissNotification,
  }
);

export default withRedux(Notifications);
