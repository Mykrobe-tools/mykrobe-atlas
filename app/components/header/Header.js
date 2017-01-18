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
    return (
      <div className={styles.container}>
        <div className={styles.menuToggle}>
          <a href="#" onClick={(e) => this.onMenuToggleClick(e)}>
            <i className="fa fa-bars" />
          </a>
        </div>
        <div className={styles.account}>
          <i className="fa fa-user" /> Sign in &middot; Register
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  toggleMenu: PropTypes.func.isRequired
};

export default Header;
