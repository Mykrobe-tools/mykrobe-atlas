/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Library.css';
import ExperimentsTable from '../experiments/ExperimentsTable';
import ExperimentsHeader from '../experiments/ExperimentsHeader';

class Library extends React.Component {
  render() {
    const { experiments } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Library</div>
        </div>
        <div className={styles.content}>
          <div className={styles.experiments}>
            <div className={styles.experimentsHeader}>
              <ExperimentsHeader experiments={experiments} />
            </div>
            <div className={styles.experimentsBody}>
              <ExperimentsTable experiments={experiments} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Library.propTypes = {
  experiments: PropTypes.object.isRequired,
};

export default Library;
