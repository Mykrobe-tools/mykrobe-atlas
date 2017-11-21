/* @flow */

import React, { Component } from 'react';
import styles from './Logo.css';
import MykrobeConfig from '../../services/MykrobeConfig';

const logosByTargetName = {
  'predictor-enterics': require('../../static/predictor-enterics-logo.svg'),
  'predictor-s-aureus': require('../../static/predictor-s-aureus-logo.svg'),
  'predictor-tb': require('../../static/predictor-tb-logo.svg'),
  'atlas-tb': require('../../static/atlas-tb-logo.svg'),
};

class Logo extends React.Component {
  mykrobeConfig: MykrobeConfig;

  constructor(props: Object) {
    super(props);
    this.mykrobeConfig = new MykrobeConfig();
  }

  render() {
    return (
      <img
        className={styles.logo}
        src={logosByTargetName[this.mykrobeConfig.targetName]}
      />
    );
  }
}

export default Logo;
