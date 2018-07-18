/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './Notifications.scss';
import Notification from './Notification';

class Notifications extends React.Component<*> {
  render() {
    const { notifications } = this.props;
    return (
      <div className={styles.container} data-tid={'component-notifications'}>
        {notifications.map((notification, index) => (
          <Notification key={`${index}`} {...notification} />
        ))}
      </div>
    );
  }

  static defaultProps = {
    notifications: [],
  };
}

Notifications.propTypes = {
  notifications: PropTypes.array,
};

export default Notifications;
