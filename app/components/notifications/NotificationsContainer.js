/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  getNotifications,
  hideNotification,
} from '../../modules/notifications';

import Notifications from './Notifications';

class NotificationsContainer extends React.Component {
  render() {
    const { notifications, hideNotification } = this.props;
    return (
      <Notifications
        notifications={notifications}
        hideNotification={hideNotification}
      />
    );
  }
}

NotificationsContainer.propTypes = {
  notifications: PropTypes.array,
  hideNotification: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    notifications: getNotifications(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      hideNotification,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(
  NotificationsContainer
);
