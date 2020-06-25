/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink as ReactRouterNavLink } from 'react-router-dom';
import {
  Button,
  Container,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import NotificationsButton from '../../notifications/NotificationsButton';
import AppDocumentTitle from '../AppDocumentTitle';
import styles from './Header.module.scss';

import { withAuthPropTypes } from 'makeandship-js-common/src/hoc/withAuth';
import { withCurrentUserPropTypes } from '../../../hoc/withCurrentUser';

class Header extends React.Component<*> {
  onLogin = (e: any) => {
    const { login } = this.props;
    e && e.preventDefault();
    login();
  };

  onRegister = (e: any) => {
    const { register } = this.props;
    e && e.preventDefault();
    register();
  };

  onProfile = (e: any) => {
    const { profile } = this.props;
    e && e.preventDefault();
    profile();
  };

  render() {
    const {
      logoutConfirm,
      currentUser,
      currentUserIsFetching,
      title,
    } = this.props;
    const hasTitle = title && title.length > 0;
    const showLoggedIn = currentUserIsFetching || currentUser;
    const displayUserName = currentUser
      ? `${currentUser.lastname}, ${currentUser.firstname}`
      : 'Profile loading';
    return (
      <Container fluid className={styles.container}>
        <div className={styles.contentWrap}>
          {hasTitle && <AppDocumentTitle title={title} />}
          {hasTitle && <div className={styles.title}>{title}</div>}
          {showLoggedIn ? (
            <div className={styles.account}>
              <NotificationsButton />
              <UncontrolledDropdown>
                <DropdownToggle
                  tag="a"
                  className={styles.currentUserDropdownToggle}
                  data-tid="current-user-dropdown-toggle"
                >
                  <span>
                    {displayUserName} <i className="fa fa-caret-down" />
                  </span>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem disabled>
                    {currentUser ? (
                      <span>
                        Signed in as
                        <br />
                        <strong>{currentUser.email}</strong>
                      </span>
                    ) : (
                      <span>Profile loading…</span>
                    )}
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem
                    tag={ReactRouterNavLink}
                    to="/users/profile"
                    data-tid="navbar-link-profile"
                    onClick={this.onProfile}
                  >
                    Your Profile
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem
                    onClick={logoutConfirm}
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
                onClick={this.onLogin}
              >
                <i className="fa fa-user" /> Log in
              </Link>
              <Button
                tag={Link}
                to="/auth/register"
                className={styles.registerLink}
                data-tid="button-sign-up"
                onClick={this.onRegister}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </Container>
    );
  }
}

Header.propTypes = {
  ...withAuthPropTypes,
  ...withCurrentUserPropTypes,
  title: PropTypes.string,
};

export default Header;
