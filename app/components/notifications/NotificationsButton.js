/* @flow */

import * as React from 'react';
import { connect } from 'react-redux';
import { UncontrolledPopover, Nav, NavItem, NavLink, Navbar } from 'reactstrap';
import { NavLink as ReactRouterNavLink } from 'react-router-dom';

import {
  getFilteredNotifications,
  setNotificationExpanded,
  dismissAllNotifications,
  dismissNotification,
  NotificationCategories,
} from '../../modules/notifications';

import styles from './NotificationsButton.module.scss';
import NotificationsContainer from './NotificationsContainer';
import NotificationsStyle from './NotificationsStyle';

class NotificationsButton extends React.Component<*> {
  onClearClick = (e) => {
    const { dismissAllNotifications } = this.props;
    e.preventDefault();
    dismissAllNotifications();
  };

  render() {
    const { notifications } = this.props;
    const hasNotifications = notifications && notifications.length > 0;
    return (
      <div className={styles.container}>
        <a id={'NotificationsButton'} className={styles.link}>
          <span className={styles.icon}>
            <i className={'fa fa-bell'} />
          </span>
          {hasNotifications && (
            <span className={styles.count}>{`${notifications.length}`}</span>
          )}
        </a>
        <UncontrolledPopover
          placement={'bottom'}
          target={'NotificationsButton'}
          trigger={'legacy'}
        >
          <Navbar color="light" expand="sm">
            <span>{hasNotifications ? 'Recent' : 'No notifications'}</span>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink
                  tag={ReactRouterNavLink}
                  to="/notifications"
                  className="text-nowrap"
                >
                  <i className="fa fa-chevron-circle-right" /> History
                </NavLink>
              </NavItem>
              {hasNotifications && (
                <NavItem>
                  <NavLink
                    href="#"
                    onClick={this.onClearClick}
                    className="text-nowrap"
                  >
                    <i className="fa fa-times-circle" /> Clear
                  </NavLink>
                </NavItem>
              )}
            </Nav>
          </Navbar>
          <NotificationsContainer
            notificationsStyle={NotificationsStyle.JOINED}
            categories={[
              NotificationCategories.ERROR,
              NotificationCategories.MESSAGE,
              NotificationCategories.SUCCESS,
            ]}
            hidden={true}
            autoHide={false}
            dismissed={false}
            order={'desc'}
            limit={5}
          />
        </UncontrolledPopover>
      </div>
    );
  }
}

const withRedux = connect(
  (state) => ({
    notifications: getFilteredNotifications(state, {
      categories: [
        NotificationCategories.ERROR,
        NotificationCategories.MESSAGE,
        NotificationCategories.SUCCESS,
      ],
      hidden: true,
      autoHide: false,
      dismissed: false,
    }),
  }),
  {
    setNotificationExpanded,
    dismissAllNotifications,
    dismissNotification,
  }
);

export default withRedux(NotificationsButton);
