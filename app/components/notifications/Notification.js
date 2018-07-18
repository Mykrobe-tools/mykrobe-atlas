/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { NotificationCategories } from '../../modules/notifications';

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
    const { id, category, content, actions, expanded, progress } = this.props;
    const icon = {
      [NotificationCategories.ERROR]: {
        icon: 'times-circle',
        style: styles.messageIcon,
      },
      [NotificationCategories.MESSAGE]: {
        icon: 'info-circle',
        style: styles.messageIcon,
      },
      [NotificationCategories.SUCCESS]: {
        icon: 'check-circle',
        style: styles.messageIcon,
      },
    }[category];
    return (
      <div className={styles.container} data-tid={'component-notification'}>
        <div className={styles.contentAndButtons}>
          <div className={icon.style}>
            <i className={`fa fa-${icon.icon}`} />
          </div>
          <div className={expanded ? styles.contentExpanded : styles.content}>
            {content}
          </div>
          <div className={styles.buttons}>
            <a href="#" onClick={this.onToggleExpandClick}>
              {expanded ? 'Collapse' : 'Expand'}
            </a>
            <a href="#" onClick={this.onCloseClick}>
              Close
            </a>
          </div>
        </div>

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
  progress: PropTypes.number,
  setNotificationExpanded: PropTypes.func,
  dismissNotification: PropTypes.func,
};

export default Notification;
