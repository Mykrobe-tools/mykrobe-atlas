import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Header.css';

class Header extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.logo} />
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
