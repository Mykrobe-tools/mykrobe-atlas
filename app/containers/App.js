/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import styles from './App.css';
import Analysing from '../components/analysing/Analysing';
import Header from '../components/header/Header';
import Menu from '../components/menu/Menu';
import MenuBg from '../components/menu/MenuBg';
import NotificationsContainer from '../components/notifications/NotificationsContainer';
import Loading from '../components/ui/Loading';

import {
  getAuth,
  signOut,
  loadAuth,
  requestCurrentUser,
} from '../modules/auth';

type State = {
  displayMenu: boolean,
};

class App extends React.Component<*, State> {
  state = {
    displayMenu: false,
  };

  componentWillMount() {
    const { loadAuth, requestCurrentUser, signOut } = this.props;

    loadAuth().then(user => {
      if (user && user.token) {
        requestCurrentUser()
          .then(() => {})
          .catch(() => {
            signOut();
          });
      }
    });
  }

  componentDidMount() {
    this.props.history.listen(() => {
      this.setState({
        displayMenu: false,
      });
    });
  }

  toggleMenu() {
    const { displayMenu } = this.state;
    this.setState({
      displayMenu: !displayMenu,
    });
  }

  render() {
    const { auth, children } = this.props;
    const { displayMenu } = this.state;

    let showLoadingView = false;
    if (!auth.user) {
      if (auth.isLoading || auth.isFetching) {
        showLoadingView = true;
      }
    }

    if (showLoadingView) {
      return <Loading />;
    }

    return (
      <div className={styles.container}>
        <div className={styles.analysingContainer}>
          <Analysing />
        </div>
        <div className={styles.notificationsContainer}>
          <NotificationsContainer />
        </div>
        <div className={styles.headerContainer}>
          <Header
            displayMenu={displayMenu}
            toggleMenu={() => this.toggleMenu()}
          />
        </div>
        <div className={styles.menuContainer}>
          <Menu displayMenu={displayMenu} />
          <MenuBg
            displayMenu={displayMenu}
            toggleMenu={() => this.toggleMenu()}
          />
        </div>
        <div className={styles.contentContainer}>{children}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: getAuth(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadAuth,
      requestCurrentUser,
      signOut,
    },
    dispatch
  );
}

App.propTypes = {
  history: PropTypes.object.isRequired,
  loadAuth: PropTypes.func.isRequired,
  requestCurrentUser: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
