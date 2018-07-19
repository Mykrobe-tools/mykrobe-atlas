/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, NavLink as ReactRouterNavLink } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import {
  Button,
  Container,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import NotificationsButton from '../notifications/NotificationsButton';
import styles from './Header.scss';

import {
  signOut,
  getIsAuthenticated,
} from 'makeandship-js-common/src/modules/auth';

import { getCurrentUser } from '../../modules/users';

class Header extends React.Component<*> {
  render() {
    const { signOut, currentUser, title } = this.props;
    const hasTitle = title && title.length > 0;
    return (
      <Container fluid className={styles.container}>
        <div className={styles.contentWrap}>
          {hasTitle && <DocumentTitle title={title} />}
          {hasTitle && <div className={styles.title}>{title}</div>}
          {currentUser ? (
            <div className={styles.account}>
              <NotificationsButton />
              <UncontrolledDropdown>
                <DropdownToggle
                  tag="a"
                  className={styles.currentUserDropdownToggle}
                  caret
                >
                  <span>
                    <i className="fa fa-user" /> {currentUser.lastname},{' '}
                    {currentUser.firstname}
                  </span>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem disabled>
                    <span>
                      Signed in as<br />
                      <strong>{currentUser.email}</strong>
                    </span>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem
                    tag={ReactRouterNavLink}
                    to="/users/profile"
                    data-tid="navbar-link-profile"
                  >
                    Your Profile
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Help</DropdownItem>
                  <DropdownItem>Settings</DropdownItem>
                  <DropdownItem
                    onClick={signOut}
                    data-tid="navbar-link-sign-out"
                  >
                    Sign out
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
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
              <Button
                tag={Link}
                to="/auth/signup"
                className={styles.signUpLink}
                data-tid="button-sign-up"
              >
                Sign up
              </Button>
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
