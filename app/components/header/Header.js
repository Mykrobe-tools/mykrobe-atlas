/* @flow */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as AuthActions from '../../actions/AuthActions';
import type { AuthType } from '../../types/AuthTypes';
import type { UserType } from '../../types/UserTypes';
import styles from './Header.css';

class Header extends Component {
  onMenuToggleClick(e: Event) {
    const { toggleMenu } = this.props;
    e.preventDefault();
    toggleMenu();
  }

  render() {
    const { displayMenu, signOut } = this.props;
    const auth: AuthType = this.props.auth;
    const user: ?UserType = auth.user;
    const { isAuthenticated } = auth;
    return (
      <div className={styles.container}>
        <a
          href="#"
          className={styles.menuToggle}
          onClick={e => this.onMenuToggleClick(e)}
        >
          <span
            className={displayMenu ? styles.menuIconClose : styles.menuIconOpen}
          />
        </a>
        {isAuthenticated ? (
          <div className={styles.account}>
            {user && (
              <Link to="/auth/profile" className={styles.authLink}>
                <i className="fa fa-user" /> My profile
              </Link>
            )}
            <a
              href="#"
              className={styles.authLink}
              onClick={() => {
                signOut();
              }}
            >
              Sign out
            </a>
          </div>
        ) : (
          <div className={styles.account}>
            <Link to="/auth/login" className={styles.authLink}>
              <i className="fa fa-user" /> Log in
            </Link>
            <Link to="/auth/signup" className={styles.signUpLink}>
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
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      signUp: AuthActions.signIn,
      signOut: AuthActions.signOut,
    },
    dispatch
  );
}

Header.propTypes = {
  auth: PropTypes.object.isRequired,
  signUp: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  displayMenu: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
