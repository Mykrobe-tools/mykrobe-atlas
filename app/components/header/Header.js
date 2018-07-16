/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import DocumentTitle from 'react-document-title';

import styles from './Header.scss';

import {
  signOut,
  getIsAuthenticated,
} from 'makeandship-js-common/src/modules/auth';

// TODO: implement with buttons
// import {
//   PrimaryButton,
//   LinkButton,
// } from 'makeandship-js-common/src/components/ui/Buttons';

import { getCurrentUser } from '../../modules/users';

class Header extends React.Component<*> {
  render() {
    const { signOut, isAuthenticated, currentUser, title } = this.props;
    const hasTitle = title && title.length > 0;
    return (
      <Container fluid className={styles.container}>
        <div className={styles.contentWrap}>
          {hasTitle && <DocumentTitle title={title} />}
          {hasTitle && <div className={styles.title}>{title}</div>}
          {isAuthenticated ? (
            <div className={styles.account}>
              {currentUser && (
                <Link
                  to="/users/profile"
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
      </Container>
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
  title: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
