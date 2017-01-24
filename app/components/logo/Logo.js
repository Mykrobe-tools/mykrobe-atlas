/* @flow */

import React, { Component } from 'react';
import styles from './Logo.css';
import MykrobeConfig from '../../services/MykrobeConfig';

class Logo extends Component {
  mykrobeConfig: MykrobeConfig;

  constructor(props: Object) {
    super(props);
    this.mykrobeConfig = new MykrobeConfig();
  }

  render() {
    const logoClassName = `${this.mykrobeConfig.targetName}-logo`;

    return (
      <div className={styles[logoClassName]} />
    );
  }
}

export default Logo;
