/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styles from './Menu.module.scss';
import Logo from '../../logo/Logo';

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
              to="/experiments?sort=modified&order=desc"
              className={styles.navigationLink}
              activeClassName={styles.navigationLinkActive}
              exact
            >
              Sample Library
            </NavLink>
          </li>
          <li className={styles.navigationItem}>
            <NavLink
              to="/organisations"
              className={styles.navigationLink}
              activeClassName={styles.navigationLinkActive}
              exact
            >
              Organisations
            </NavLink>
          </li>
        </ul>
        <ul className={styles.navigationFooter}>
          <li className={styles.navigationItem}>
            <a
              className={styles.navigationLink}
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.ebi.ac.uk/data-protection/privacy-notice/mykrobe-atlas-database"
            >
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

Menu.propTypes = {
  displayMenu: PropTypes.bool,
};

export default Menu;
