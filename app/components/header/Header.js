import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Header.css';
import MykrobeConfig from 'api/MykrobeConfig';

class Header extends Component {
  constructor() {
    super();
    this.mykrobeConfig = new MykrobeConfig();
  }

  render() {
    // const logoStyle= {
    //   width: '211px',
    //   height: '60px',
    //   background: `static/${this.mykrobeConfig.targetName}-logo.svg`
    // };
    // console.log('logoStyle', logoStyle);
    const logoClassName = `${this.mykrobeConfig.targetName}-logo`;
    return (
      <div className={styles.container}>
        <div className={styles[logoClassName]} />
        <div className={styles.account}>
          Account
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
