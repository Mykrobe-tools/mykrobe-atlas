/* @flow */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './Menu.css';
import Logo from '../logo/Logo';

class Menu extends Component {
  render() {
    const {displayMenu} = this.props;
    return (
      <div className={displayMenu ? styles.containerDisplayed : styles.container}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <ul className={styles.navigation}>
          <li className={styles.navigationItem}>
            <Link to="/" className={styles.navigationLink} activeClassName={styles.navigationLinkActive} onlyActiveOnIndex>Home</Link>
          </li>
          <li className={styles.navigationItem}>
            <Link to="/library" className={styles.navigationLink} activeClassName={styles.navigationLinkActive}>Library</Link>
          </li>
        </ul>
      </div>
    );
  }
}

Menu.propTypes = {
  displayMenu: PropTypes.bool.isRequired
};

export default Menu;
