/* @flow */

import React, { Component } from 'react';
import styles from './Loading.css';

class Loading extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.activityIndicator} />
      </div>
    );
  }
}

export default Loading;
