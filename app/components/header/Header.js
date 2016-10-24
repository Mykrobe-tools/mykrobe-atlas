/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Header.css';
import MykrobeConfig from 'api/MykrobeConfig';

class Header extends Component {
  mykrobeConfig: MykrobeConfig;

  constructor() {
    super();
    this.mykrobeConfig = new MykrobeConfig();
  }

  render() {
    const logoClassName = `${this.mykrobeConfig.targetName}-logo`;
    return (
      <div className={styles.container}>
        <div className={styles[logoClassName]} />
        <div className={styles.account}>
          <i className="fa fa-user" /> Sign in &middot; Register
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Header);
