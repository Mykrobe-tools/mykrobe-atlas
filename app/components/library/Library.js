/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './Library.css';
import ExperimentsTable from '../experiments/ExperimentsTable';
import ExperimentsHeader from '../experiments/ExperimentsHeader';

class Library extends Component {
  render() {
    const {experiments} = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Library
          </h1>
        </div>
        <div className={styles.content}>
          {experiments.isFetching &&
            <div className={styles.loading}>
              Fetching experiments...
            </div>
          }
          {!experiments.isFetching &&
            <div className={styles.experiments}>
              <div className={styles.experimentsHeader}>
                <ExperimentsHeader />
              </div>
              <div className={styles.experimentsBody}>
                {experiments.samples.length === 0 &&
                  <p>
                    No results found
                  </p>
                }
                {experiments.samples.length > 0 &&
                  <ExperimentsTable experiments={experiments.samples} />
                }
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

Library.propTypes = {
  experiments: PropTypes.object.isRequired
};

export default Library;
