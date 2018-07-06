/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import Notifications from 'makeandship-js-common/src/components/notifications/Notifications';

import styles from './App.css';
import Analysing from '../components/analysing/Analysing';
import Header from '../components/header/Header';
import Menu from '../components/menu/Menu';
import MenuBg from '../components/menu/MenuBg';
import Loading from '../components/ui/Loading';

import { getIsFetching as getAuthIsFetching } from 'makeandship-js-common/src/modules/auth';
import { getCurrentUserIsFetching } from '../modules/users';

type State = {
  displayMenu: boolean,
};

class App extends React.Component<*, State> {
  state = {
    displayMenu: false,
  };

  componentWillMount() {
    // TODO: ininitialising auth and sign out shoudl now be handled by sagas - check
    // const { loadAuth, requestCurrentUser, signOut } = this.props;
    // loadAuth().then(user => {
    //   if (user && user.token) {
    //     requestCurrentUser()
    //       .then(() => {})
    //       .catch(() => {
    //         signOut();
    //       });
    //   }
    // });
  }

  componentDidMount() {
    this.props.history.listen(() => {
      this.setState({
        displayMenu: false,
      });
    });
  }

  toggleMenu = () => {
    const { displayMenu } = this.state;
    this.setState({
      displayMenu: !displayMenu,
    });
  };

  render() {
    const { isFetching, children } = this.props;
    const { displayMenu } = this.state;

    if (isFetching) {
      return <Loading />;
    }

    return (
      <div className={styles.container}>
        <div className={styles.analysingContainer}>
          <Analysing />
        </div>
        <Notifications />
        <div className={styles.headerContainer}>
          <Header displayMenu={displayMenu} toggleMenu={this.toggleMenu} />
        </div>
        <div className={styles.menuContainer}>
          <Menu displayMenu={displayMenu} />
          <MenuBg displayMenu={displayMenu} toggleMenu={this.toggleMenu} />
        </div>
        <div className={styles.contentContainer}>{children}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: getCurrentUserIsFetching(state) || getAuthIsFetching(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

App.propTypes = {
  history: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
