import React, { Component, PropTypes } from 'react';
import styles from './Header.css';

class Header extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.logo}>
          logo
        </div>
        <div className={styles.account}>
          Account
        </div>
      </div>
    );
  }
}

export default Header;
