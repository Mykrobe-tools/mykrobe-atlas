/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './MenuBg.css';

class MenuBg extends Component {
  render() {
    const {displayMenu, toggleMenu} = this.props;
    return (
      <div className={displayMenu ? styles.containerDisplayed : styles.container} onClick={() => toggleMenu()} />
    );
  }
}

MenuBg.propTypes = {
  displayMenu: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired
};

export default MenuBg;
