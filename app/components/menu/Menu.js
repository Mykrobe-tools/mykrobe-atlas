/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styles from './Menu.scss';
import Logo from '../logo/Logo';

class Menu extends React.Component<*> {
  render() {
    const { displayMenu } = this.props;
    return (
      <div
        className={displayMenu ? styles.containerDisplayed : styles.container}
      >
        <div className={styles.logoWrap}>
          <Logo />
        </div>
        <ul className={styles.navigation}>
          <li className={styles.navigationItem}>
            <NavLink
              to="/"
              className={styles.navigationLink}
              activeClassName={styles.navigationLinkActive}
              exact
            >
              Home
            </NavLink>
          </li>
          <li className={styles.navigationItem}>
            <NavLink
              to="/experiments"
              className={styles.navigationLink}
              activeClassName={styles.navigationLinkActive}
            >
              Sample Library
            </NavLink>
          </li>
          <li className={styles.navigationItem}>
            <NavLink
              to="/organisations"
              className={styles.navigationLink}
              activeClassName={styles.navigationLinkActive}
            >
              Organisations
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

Menu.propTypes = {
  displayMenu: PropTypes.bool.isRequired,
};

export default Menu;
