/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container, Button } from 'reactstrap';
import pluralize from 'pluralize';

import Pagination from 'makeandship-js-common/src/components/ui/pagination';
import PageHeader, {
  styles as pageHeaderStyles,
} from 'makeandship-js-common/src/components/ui/PageHeader';
import { PrimaryButton } from 'makeandship-js-common/src/components/ui/Buttons';

import styles from './Experiments.scss';
import ExperimentsTable from '../experiments/ExperimentsTable';
import Header from '../header/Header';

class Experiments extends React.Component<*> {
  onNewExperiment = e => {
    e && e.preventDefault();
    const { newExperiment } = this.props;
    newExperiment();
  };

  render() {
    const {
      experiments,
      experimentsFilters,
      isFetchingExperiments,
      onExperimentClick,
      onChangeListOrder,
      setPage,
    } = this.props;
    const { pagination, results, summary } = experiments;
    const total = summary && summary.hits;
    const title = total
      ? `${total.toLocaleString()} ${pluralize('Experiment', total)}`
      : 'Experiments';

    return (
      <div className={styles.container}>
        <Header title={'Experiments'} />
        <Container fluid>
          <PageHeader border={false}>
            <div>
              <div className={pageHeaderStyles.title}>{title}</div>
            </div>
            <div>
              <Button outline size="sm">
                <i className="fa fa-arrow-circle-down" /> Export
              </Button>
              <PrimaryButton
                onClick={this.onNewExperiment}
                outline
                size="sm"
                icon="plus-circle"
                marginLeft
              >
                New experiment
              </PrimaryButton>
            </div>
          </PageHeader>
          <div className={styles.experimentsBody}>
            <ExperimentsTable
              isFetching={isFetchingExperiments}
              experiments={results}
              onExperimentClick={onExperimentClick}
              onChangeOrder={onChangeListOrder}
              filters={experimentsFilters}
            />
            {pagination && (
              <Pagination
                first={1}
                last={pagination.pages}
                current={pagination.page}
                onPageClick={setPage}
              />
            )}
          </div>
        </Container>
      </div>
    );
  }
}

Experiments.propTypes = {
  experiments: PropTypes.object.isRequired,
  experimentsFilters: PropTypes.any,
  requestExperiments: PropTypes.func,
  requestFilterValues: PropTypes.func,
  isFetchingExperiments: PropTypes.bool,
  isFetchingFilters: PropTypes.bool,
  onExperimentClick: PropTypes.func,
  onChangeListOrder: PropTypes.func,
  setPage: PropTypes.func,
  newExperiment: PropTypes.func,
};

export default Experiments;
