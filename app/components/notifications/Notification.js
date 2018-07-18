/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './Notification.scss';

class Notification extends React.Component<*> {
  onToggleExpandClick = (e: Event) => {
    const { id, setNotificationExpanded, expanded } = this.props;
    e.preventDefault();
    setNotificationExpanded(id, !expanded);
  };

  onCloseClick = (e: Event) => {
    const { id, dismissNotification } = this.props;
    e.preventDefault();
    dismissNotification(id);
  };

  render() {
    const { id, category, content, actions, expanded } = this.props;
    return (
      <div className={styles.container} data-tid={'component-notification'}>
        <div className={expanded ? styles.contentExpanded : styles.content}>
          Expanded: {expanded ? 'true' : 'false'} {category} {content}
        </div>
        <a href="#" onClick={this.onToggleExpandClick}>
          {expanded ? 'Collapse' : 'Expand'}
        </a>
        <a href="#" onClick={this.onCloseClick}>
          Close
        </a>
        {actions &&
          actions.map((action, index) => (
            <a
              key={`${index}`}
              href="#"
              onClick={e => {
                e.preventDefault();
                action.onClick(id);
              }}
            >
              {action.title}
            </a>
          ))}
      </div>
    );
  }
}

Notification.propTypes = {
  id: PropTypes.string.isRequired,
  category: PropTypes.string,
  content: PropTypes.string,
  actions: PropTypes.array,
  expanded: PropTypes.bool,
  setNotificationExpanded: PropTypes.func,
  dismissNotification: PropTypes.func,
};

export default Notification;
