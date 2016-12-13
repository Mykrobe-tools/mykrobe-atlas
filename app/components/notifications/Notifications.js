/* @flow */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as NotificationActions from 'actions/NotificationActions';

import Notification from './Notification';
import styles from './Notifications.css';

class Notifications extends Component {

  constructor(props: Object) {
    super(props);
  }

  onClick(id) {
    const {hideNotification} = this.props;
    hideNotification(id);
  }

  render() {
    const {notifications} = this.props;
    return (
      <div className={styles.wrap}>
        {notifications.map(notification => {
          return (
            <div key={notification.id}>
              <Notification
                content={notification.content}
                category={notification.category.toLowerCase()}
                id={notification.id}
                onClick={this.onClick.bind(this)} />
            </div>
          )
        })}
      </div>
    );
  }
}

Notifications.propTypes = {
  notifications: PropTypes.array
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    hideNotification: NotificationActions.hideNotification
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
