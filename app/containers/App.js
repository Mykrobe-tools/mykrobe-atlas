/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './App.css';
import Header from '../components/header/Header';
import Notifications from '../components/notifications/Notifications';

class App extends Component {

  render() {
    const {children, notifications} = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.notificationsContainer}>
          {notifications &&
            <Notifications notifications={notifications} />
          }
        </div>
        <div className={styles.headerContainer}>
          <Header />
        </div>
        <div className={styles.contentContainer}>
          {children}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    notifications: state.notifications
  };
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  notifications: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(App);
