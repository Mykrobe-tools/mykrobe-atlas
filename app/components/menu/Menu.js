/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './Menu.css';
import MykrobeConfig from '../../api/MykrobeConfig';

class Menu extends Component {
  mykrobeConfig: MykrobeConfig;

  constructor(props: Object) {
    super(props);
    this.mykrobeConfig = new MykrobeConfig();
  }

  render() {
    const {displayMenu} = this.props;
    const logoClassName = `${this.mykrobeConfig.targetName}-logo`;
    return (
      <div className={displayMenu ? styles.containerDisplayed : styles.container}>
        <div className={styles[logoClassName]} />
      </div>
    );
  }
}

Menu.propTypes = {
  displayMenu: PropTypes.bool.isRequired
};

export default Menu;
