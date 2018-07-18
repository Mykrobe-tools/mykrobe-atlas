/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './Notifications.scss';
import Notification from './Notification';

class Notifications extends React.Component<*> {
  render() {
    const {
      notifications,
      setNotificationExpanded,
      dismissNotification,
    } = this.props;
    return (
      <div className={styles.container} data-tid={'component-notifications'}>
        {notifications &&
          Object.keys(notifications).map(id => {
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
}

Notifications.propTypes = {
  notifications: PropTypes.array,
  setNotificationExpanded: PropTypes.func,
  dismissAllNotifications: PropTypes.func,
  dismissNotification: PropTypes.func,
};

export default Notifications;
