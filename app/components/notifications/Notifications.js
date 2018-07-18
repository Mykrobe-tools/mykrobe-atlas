/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './Notifications.scss';
import Notification from './Notification';

class Notifications extends React.Component<*> {
  render() {
    const {
      hideDismissed,
      notifications,
      setNotificationExpanded,
      dismissNotification,
    } = this.props;
    const filteredNotifications = {};
    Object.keys(notifications).map(id => {
      const notification = notifications[id];
      if (hideDismissed && notification.dismissed) {
        // keep it
      } else {
        filteredNotifications[id] = notification;
      }
    });
    if (!Object.keys(filteredNotifications).length) {
      return null;
    }
    return (
      <div className={styles.container} data-tid={'component-notifications'}>
        {Object.keys(filteredNotifications).map(id => {
          const notification = notifications[id];
          return (
            <Notification
              key={id}
              {...notification}
              setNotificationExpanded={setNotificationExpanded}
              dismissNotification={dismissNotification}
            />
          );
        })}
      </div>
    );
  }
  static defaultProps = {
    hideDismissed: false,
  };
}

Notifications.propTypes = {
  notifications: PropTypes.object,
  setNotificationExpanded: PropTypes.func,
  dismissAllNotifications: PropTypes.func,
  dismissNotification: PropTypes.func,
  hideDismissed: PropTypes.bool,
};

export default Notifications;
