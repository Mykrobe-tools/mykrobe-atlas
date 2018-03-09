/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import Notification from './Notification';
import styles from './Notifications.css';

class Notifications extends React.Component<*> {
  onClick(id: Number) {
    const { hideNotification } = this.props;
    hideNotification(id);
  }

  render() {
    const { notifications } = this.props;
    return (
      <div className={styles.wrap} data-tid="component-notifications">
        {notifications.map(notification => {
          const { id, content, category } = notification;
          return (
            <div className={styles.notification} key={id}>
              <Notification
                content={content}
                category={category.toLowerCase()}
                id={id}
                onClick={() => this.onClick(id)}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

Notifications.propTypes = {
  notifications: PropTypes.array,
  hideNotification: PropTypes.func.isRequired,
};

export default Notifications;
