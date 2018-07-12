/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';

import styles from './ExperimentsHeader.css';

class ExperimentsHeader extends React.Component<*> {
  render() {
    const { experiments } = this.props;
    const total = experiments.summary && experiments.summary.hits;
    const title = total
      ? `${total.toLocaleString()} ${pluralize('Experiment', total)}`
      : 'Experiments';
    return (
      <div className={styles.header}>
        <div className={styles.count}>{title}</div>
      </div>
    );
  }
}

ExperimentsHeader.propTypes = {
  experiments: PropTypes.object.isRequired,
  requestExperiments: PropTypes.func.isRequired,
};

export default ExperimentsHeader;
