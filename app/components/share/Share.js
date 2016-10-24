/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Share.css';

class Share extends Component {
  render() {
    const {children} = this.props;
    return (
      <div className={styles.container}>
        Share
      </div>
    );
  }
}

export default Share;
