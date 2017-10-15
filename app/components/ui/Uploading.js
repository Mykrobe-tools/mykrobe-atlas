/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './Uploading.css';

class Uploading extends Component {
  render() {
    const { sectionName } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.icon}>
          <i className="fa fa-clock-o fa-3x" />
        </div>
        <h2 className={styles.title}>Uploading</h2>
        <p className={styles.text}>
          {sectionName} will be available here on completion
        </p>
      </div>
    );
  }
}

Uploading.propTypes = {
  sectionName: PropTypes.string.isRequired,
};

export default Uploading;
