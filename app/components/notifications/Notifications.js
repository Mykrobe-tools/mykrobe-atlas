/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import styles from './Notifications.scss';
import Notification from './Notification';
import NotificationsStyle from './NotificationsStyle';

class Notifications extends React.Component<*> {
  filteredNotifications = () => {
    const { hideDismissed, notifications, order, limit } = this.props;
    const filteredNotifications = [];
    Object.keys(notifications).map(id => {
      const notification = notifications[id];
      if (hideDismissed && notification.dismissed) {
        // keep it
      } else {
        filteredNotifications.push(notification);
      }
    });
    const sorted = _.orderBy(filteredNotifications, 'added', order);
    return limit && sorted.length > limit ? sorted.slice(0, limit) : sorted;
  };

  render() {
    const {
      setNotificationExpanded,
      dismissNotification,
      notificationsStyle,
    } = this.props;
    const filteredNotifications = this.filteredNotifications();
    return (
      <div className={styles.container} data-tid={'component-notifications'}>
        <TransitionGroup>
          {filteredNotifications.map(notification => (
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
    hideDismissed: false,
    notificationsStyle: NotificationsStyle.DEFAULT,
    order: 'asc',
  };
}

Notifications.propTypes = {
  notifications: PropTypes.object,
  setNotificationExpanded: PropTypes.func,
  dismissAllNotifications: PropTypes.func,
  dismissNotification: PropTypes.func,
  hideDismissed: PropTypes.bool,
  notificationsStyle: PropTypes.string,
  order: PropTypes.string,
  limit: PropTypes.number,
};

export default Notifications;
