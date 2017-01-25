/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './Header.css';

class Header extends Component {
  onMenuToggleClick(e: Event) {
    const {toggleMenu} = this.props;
    e.preventDefault();
    toggleMenu();
  }

  render() {
    const {displayMenu} = this.props;
    return (
      <div className={styles.container}>
        <a href="#"
          className={styles.menuToggle}
          onClick={(e) => this.onMenuToggleClick(e)}>
          <span className={displayMenu ? styles.menuIconClose : styles.menuIconOpen} />
        </a>
        <div className={styles.account}>
          <i className="fa fa-user" /> Sign in &middot; Register
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  displayMenu: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired
};

export default Header;
