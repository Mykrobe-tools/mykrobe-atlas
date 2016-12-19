/* @flow */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as NotificationActions from '../../actions/NotificationActions';

import Notification from './Notification';
import styles from './Notifications.css';

export class Notifications extends Component {

  constructor(props: Object) {
    super(props);
  }

  onClick(id: Number) {
    const {hideNotification} = this.props;
    hideNotification(id);
  }

  render() {
    const {notifications} = this.props;
    return (
      <div className={styles.wrap}>
        {notifications.map(notification => {
          const {id, content, category} = notification;
          return (
            <div key={id}>
              <Notification
                content={content}
                category={category.toLowerCase()}
                id={id}
                onClick={event => this.onClick(id)} />
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
