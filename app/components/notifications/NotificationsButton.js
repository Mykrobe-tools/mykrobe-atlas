/* @flow */

import * as React from 'react';
import { connect } from 'react-redux';
import { Popover, PopoverHeader } from 'reactstrap';

import {
  getFilteredNotifications,
  setNotificationExpanded,
  dismissAllNotifications,
  dismissNotification,
  NotificationCategories,
} from '../../modules/notifications';

import styles from './NotificationsButton.scss';
import NotificationsContainer from './NotificationsContainer';
import NotificationsStyle from './NotificationsStyle';

type State = {
  popoverOpen: boolean,
};

class NotificationsButton extends React.Component<*, State> {
  state = {
    popoverOpen: false,
  };

  toggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  };

  onIconClick = e => {
    e.preventDefault();
    this.toggle();
  };

  render() {
    const { notifications } = this.props;
    const hasNotifications = notifications && notifications.length > 0;
    return (
      <div className={styles.container}>
        <a
          className={styles.link}
          href="#"
          id={'NotificationsButton'}
          onClick={this.onIconClick}
        >
          <span className={styles.icon}>
            <i className={'fa fa-bell'} />
          </span>
          {hasNotifications && (
            <span className={styles.count}>{`${notifications.length}`}</span>
          )}
        </a>
        <Popover
          placement={'bottom'}
          isOpen={this.state.popoverOpen}
          target={'NotificationsButton'}
          toggle={this.toggle}
        >
          <PopoverHeader>Popover Title</PopoverHeader>
          <NotificationsContainer
            notificationsStyle={NotificationsStyle.JOINED}
            categories={[
              NotificationCategories.ERROR,
              NotificationCategories.MESSAGE,
            ]}
            hidden={true}
            dismissed={false}
            order={'desc'}
            limit={5}
          />
        </Popover>
      </div>
    );
  }
}

const withRedux = connect(
  state => ({
    notifications: getFilteredNotifications(state, {
      categories: [
        NotificationCategories.ERROR,
        NotificationCategories.MESSAGE,
      ],
      hidden: true,
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
