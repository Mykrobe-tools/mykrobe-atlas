/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import styles from './App.css';
import Analysing from '../components/analysing/Analysing';
import Header from '../components/header/Header';
import Menu from '../components/menu/Menu';
import MenuBg from '../components/menu/MenuBg';
import Notifications from '../components/notifications/Notifications';
import * as AuthActions from '../actions/AuthActions';
import type { AuthType } from '../types/AuthTypes';
import Loading from '../components/ui/Loading';

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

  componentWillMount() {
    const {loadAuth, fetchCurrentUser, signOut} = this.props;
    const auth: AuthType = this.props.auth;

    loadAuth().then((user) => {
      if (user && user.token) {
        fetchCurrentUser().then(() => {
        })
        .catch((error) => { //eslint-disable-line
          // if we can't fetch surgery or user, sign out
          signOut();
        });
      }
    });
  }

  componentDidMount() {
    browserHistory.listen(location => {
      this.setState({
        displayMenu: false
      });
    });
  }

  toggleMenu() {
    const {displayMenu} = this.state;
    this.setState({
      displayMenu: !displayMenu
    });
  }

  render() {
    const {auth, children} = this.props;
    const {displayMenu} = this.state;

    let showLoadingView = false;
    if (!auth.user) {
      if (auth.isLoading || auth.isFetching) {
        showLoadingView = true;
      }
    }

    if (showLoadingView) {
      return (
        <Loading />
      );
    }

    return (
      <div className={styles.container}>
        <div className={styles.analysingContainer}>
          <Analysing />
        </div>
        <div className={styles.notificationsContainer}>
          <Notifications />
        </div>
        <div className={styles.headerContainer}>
          <Header displayMenu={displayMenu} toggleMenu={() => this.toggleMenu()} />
        </div>
        <div className={styles.menuContainer}>
          <Menu displayMenu={displayMenu} />
          <MenuBg displayMenu={displayMenu} toggleMenu={() => this.toggleMenu()} />
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
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadAuth: AuthActions.loadAuth,
    fetchCurrentUser: AuthActions.fetchCurrentUser,
    signOut: AuthActions.signOut
  }, dispatch);
}

App.propTypes = {
  loadAuth: PropTypes.func.isRequired,
  fetchCurrentUser: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
