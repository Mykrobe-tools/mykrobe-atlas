/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import styles from './Header.css';

import {
  signOut,
  getIsAuthenticated,
} from 'makeandship-js-common/src/modules/auth';

import { getCurrentUser } from '../../modules/users';

class Header extends React.Component<*> {
  onMenuToggleClick = (e: Event) => {
    const { toggleMenu } = this.props;
    e.preventDefault();
    toggleMenu();
  };

  render() {
    const { displayMenu, signOut, isAuthenticated, currentUser } = this.props;
    return (
      <div className={styles.container}>
        <a
          href="#"
          className={styles.menuToggle}
          onClick={this.onMenuToggleClick}
        >
          <span
            className={displayMenu ? styles.menuIconClose : styles.menuIconOpen}
          />
        </a>
        {isAuthenticated ? (
          <div className={styles.account}>
            {currentUser && (
              <Link
                to="/auth/profile"
                className={styles.authLink}
                data-tid="button-my-profile"
              >
                <i className="fa fa-user" /> My profile
              </Link>
            )}
            <a
              href="#"
              className={styles.authLink}
              onClick={() => {
                signOut();
              }}
              data-tid="button-sign-out"
            >
              Sign out
            </a>
          </div>
        ) : (
          <div className={styles.account}>
            <Link
              to="/auth/login"
              className={styles.authLink}
              data-tid="button-log-in"
            >
              <i className="fa fa-user" /> Log in
            </Link>
            <Link
              to="/auth/signup"
              className={styles.signUpLink}
              data-tid="button-sign-up"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: getIsAuthenticated(state),
    currentUser: getCurrentUser(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      signOut,
    },
    dispatch
  );
}

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  signOut: PropTypes.func.isRequired,
  displayMenu: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
