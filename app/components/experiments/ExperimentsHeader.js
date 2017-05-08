/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './ExperimentsHeader.css';

class ExperimentsHeader extends Component {
  render() {
    const {experiments} = this.props;
    return (
      <div className={styles.header}>
        <div className={styles.filters}>
          [Experiment table filters]
        </div>
        <div className={styles.count}>
          {experiments.samples.length} found
        </div>
      </div>
    );
  }
}

ExperimentsHeader.propTypes = {
  experiments: PropTypes.object.isRequired
};

export default ExperimentsHeader;
