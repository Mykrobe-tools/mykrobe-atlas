/* @flow */

import * as React from 'react';
import { connect } from 'react-redux';
import { Badge, Popover, PopoverHeader } from 'reactstrap';

import {
  getNotifications,
  setNotificationExpanded,
  dismissAllNotifications,
  dismissNotification,
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
    return (
      <div>
        <a
          className={styles.container}
          href="#"
          id={'NotificationsButton'}
          onClick={this.onIconClick}
        >
          <span className={styles.icon}>
            <i className={'fa fa-bell'} />
          </span>
          <Badge color="danger" pill>
            {`${notifications.length}`}
          </Badge>
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
    notifications: getNotifications(state),
  }),
  {
    setNotificationExpanded,
    dismissAllNotifications,
    dismissNotification,
  }
);

export default withRedux(NotificationsButton);
