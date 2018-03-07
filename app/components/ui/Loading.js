/* @flow */

import * as React from 'react';
import styles from './Loading.css';

class Loading extends React.Component<*> {
  render() {
    return (
      <div className={styles.container} data-tid="component-loading">
        <div className={styles.activityIndicator} />
      </div>
    );
  }
}

export default Loading;
