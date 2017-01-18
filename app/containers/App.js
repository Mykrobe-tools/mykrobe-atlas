/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './App.css';
import Header from '../components/header/Header';
import Menu from '../components/menu/Menu';
import Notifications from '../components/notifications/Notifications';

class App extends Component {
  state = {
    displayMenu: Boolean
  };

  constructor(props: Object) {
    super(props);
    this.state = {
      displayMenu: false
    };
  }

  toggleMenu() {
    const {displayMenu} = this.state;
    this.setState({
      displayMenu: !displayMenu
    });
  }

  render() {
    const {children, notifications} = this.props;
    const {displayMenu} = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.notificationsContainer}>
          {notifications &&
            <Notifications notifications={notifications} />
          }
        </div>
        <div className={styles.headerContainer}>
          <Header toggleMenu={() => this.toggleMenu()} />
        </div>
        <div className={styles.menuContainer}>
          <Menu displayMenu={displayMenu} />
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
