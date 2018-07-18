/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { NotificationCategories } from '../../modules/notifications';

import styles from './Notification.scss';
import NotificationsStyle from './NotificationsStyle';

type State = {
  expandable: boolean,
};

class Notification extends React.Component<*, State> {
  _contentRef: ?Element;

  state = {
    expandable: true,
  };

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

  onContentRef = (ref: Element | null) => {
    if (!ref) {
      return;
    }
    this._contentRef = ref;
    this.checkExpandable();
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.checkExpandable();
  };

  checkExpandable = () => {
    if (!this._contentRef) {
      return;
    }
    let expandable = false;
    if (this._contentRef.scrollWidth > this._contentRef.clientWidth) {
      expandable = true;
    }
    this.setState({ expandable });
  };

  render() {
    const {
      id,
      category,
      content,
      actions,
      expanded,
      progress,
      notificationsStyle,
    } = this.props;
    const { expandable } = this.state;
    const icon = {
      [NotificationCategories.ERROR]: {
        icon: 'times-circle',
        style: styles.errorIcon,
      },
      [NotificationCategories.MESSAGE]: {
        icon: 'info-circle',
        style: styles.messageIcon,
      },
      [NotificationCategories.SUCCESS]: {
        icon: 'check-circle',
        style: styles.successIcon,
      },
    }[category];
    const containerStyle = {
      [NotificationsStyle.DEFAULT]: styles.container,
      [NotificationsStyle.SEPARATE]: styles.containerSeparate,
      [NotificationsStyle.JOINED]: styles.containerJoined,
    }[notificationsStyle];
    return (
      <div className={containerStyle} data-tid={'component-notification'}>
        <div className={styles.contentAndButtons}>
          <div className={icon.style}>
            <i className={`fa fa-${icon.icon}`} />
          </div>
          <div className={styles.content} onClick={this.onToggleExpandClick}>
            <div
              style={{
                visibility: expandable && expanded ? 'hidden' : 'visible',
                height: expandable && expanded ? '0' : 'auto',
              }}
              ref={this.onContentRef}
              className={styles.contentConstrained}
            >
              {content}
            </div>
            <div
              style={{
                visibility: expandable && expanded ? 'visible' : 'hidden',
                height: expandable && expanded ? 'auto' : '0',
              }}
            >
              {content}
            </div>
          </div>
          <div className={styles.buttons}>
            {expandable && (
              <a
                href="#"
                className={styles.button}
                onClick={this.onToggleExpandClick}
              >
                <i className={`fa fa-caret-${expanded ? 'up' : 'down'}`} />
              </a>
            )}
            <a href="#" className={styles.button} onClick={this.onCloseClick}>
              <i className={`fa fa-times`} />
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
  static defaultProps = {
    notificationsStyle: NotificationsStyle.DEFAULT,
  };
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
  notificationsStyle: PropTypes.string,
};

export default Notification;
