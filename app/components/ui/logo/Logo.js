/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Logo.module.scss';

const LOGOS = {
  'atlas-desktop-enterics': require('../../../static/atlas-enterics-logo.svg'),
  'atlas-desktop-s-aureus': require('../../../static/atlas-s-aureus-logo.svg'),
  'atlas-desktop-tb': require('../../../static/atlas-tb-logo.svg'),
  'atlas-tb': require('../../../static/atlas-tb-logo.svg'),
  desktop: require('../../../static/desktop-logo.svg'),
};

const logoSrc = LOGOS[IS_ELECTRON ? 'desktop' : 'atlas-tb'];

class Logo extends React.Component<*> {
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
    return <img className={styles.logo} style={style} src={logoSrc} />;
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
