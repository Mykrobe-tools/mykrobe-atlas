/* @flow */

import React, { Component, PropTypes } from 'react';

import styles from './Notification.css';

class Notification extends Component {
  onClick(event: Event) {
    const { onClick, id } = this.props;
    event.preventDefault();
    onClick(id);
  }

  render() {
    const { category, content } = this.props;
    let icon;
    switch (category) {
      case 'success':
        icon = 'fa fa-check-circle';
        break;
      case 'message':
        icon = 'fa fa-info-circle';
        break;
      case 'error':
        icon = 'fa fa-exclamation-circle';
        break;
    }
    return (
      <a className={styles[category]} onClick={event => this.onClick(event)}>
        <p className={styles.content}>
          {icon && (
            <span className={styles.icon}>
              <i className={icon} />
            </span>
          )}
          {content}
        </p>
        <span className={styles.close}>
          <i className="fa fa-times-circle" />
        </span>
      </a>
    );
  }
}

Notification.propTypes = {
  category: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default Notification;
