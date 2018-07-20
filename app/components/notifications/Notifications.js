/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import styles from './Notifications.scss';
import Notification from './Notification';
import NotificationsStyle from './NotificationsStyle';

class Notifications extends React.Component<*> {
  render() {
    const {
      notifications,
      setNotificationExpanded,
      dismissNotification,
      notificationsStyle,
    } = this.props;
    return (
      <div className={styles.container} data-tid={'component-notifications'}>
        <TransitionGroup>
          {notifications.map(notification => (
            <CSSTransition
              key={notification.id}
              classNames={styles}
              timeout={300}
            >
              <Notification
                key={notification.id}
                {...notification}
                setNotificationExpanded={setNotificationExpanded}
                dismissNotification={dismissNotification}
                notificationsStyle={notificationsStyle}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    );
  }
  static defaultProps = {
    notificationsStyle: NotificationsStyle.DEFAULT,
  };
}

Notifications.propTypes = {
  notifications: PropTypes.array,
  setNotificationExpanded: PropTypes.func,
  dismissAllNotifications: PropTypes.func,
  dismissNotification: PropTypes.func,
  hideDismissed: PropTypes.bool,
  notificationsStyle: PropTypes.string,
  order: PropTypes.string,
  limit: PropTypes.number,
};

export default Notifications;
