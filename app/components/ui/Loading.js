/* @flow */

import React, { Component } from 'react';
import styles from './Loading.css';

class Loading extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.activityIndicator} />
      </div>
    );
  }
}

export default Loading;
