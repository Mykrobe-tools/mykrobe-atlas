/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

import styles from './Experiments.scss';
import ExperimentsTable from '../experiments/ExperimentsTable';
import ExperimentsHeader from '../experiments/ExperimentsHeader';
import Header from '../header/Header';

class Experiments extends React.Component<*> {
  render() {
    const {
      experiments,
      filterValues,
      requestExperiments,
      requestFilterValues,
      isFetchingExperiments,
    } = this.props;
    return (
      <div className={styles.container}>
        <Header title={'Experiments'} />
        <Container fluid>
          <div className={styles.experimentsHeader}>
            <ExperimentsHeader
              experiments={experiments}
              filterValues={filterValues}
              requestExperiments={requestExperiments}
              requestFilterValues={requestFilterValues}
            />
          </div>
          <div className={styles.experimentsBody}>
            <ExperimentsTable
              isFetching={isFetchingExperiments}
              experiments={experiments}
            />
          </div>
        </Container>
      </div>
    );
  }
}

Experiments.propTypes = {
  experiments: PropTypes.object.isRequired,
  filterValues: PropTypes.array.isRequired,
  requestExperiments: PropTypes.func.isRequired,
  requestFilterValues: PropTypes.func.isRequired,
  isFetchingExperiments: PropTypes.bool.isRequired,
  isFetchingFilters: PropTypes.bool.isRequired,
};

export default Experiments;
