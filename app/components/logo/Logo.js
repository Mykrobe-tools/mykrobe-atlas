/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Logo.css';
import MykrobeConfig from '../../services/MykrobeConfig';

const logosByTargetName = {
  'atlas-desktop-enterics': require('../../static/atlas-enterics-logo.svg'),
  'atlas-desktop-s-aureus': require('../../static/atlas-s-aureus-logo.svg'),
  'atlas-desktop-tb': require('../../static/atlas-tb-logo.svg'),
  'atlas-tb': require('../../static/atlas-tb-logo.svg'),
};

class Logo extends React.Component {
  mykrobeConfig: MykrobeConfig;

  constructor(props: Object) {
    super(props);
    this.mykrobeConfig = new MykrobeConfig();
  }

  render() {
    const { width, height } = this.props;
    let style = {
      height,
    };
    if (width) {
      style = {
        width,
      };
    }
    return (
      <img
        className={styles.logo}
        style={style}
        src={logosByTargetName[this.mykrobeConfig.targetName]}
      />
    );
  }

  static defaultProps = {
    height: 60,
  };
}

Logo.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Logo;
