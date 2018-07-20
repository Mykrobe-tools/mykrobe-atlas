/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container, Button, ButtonToolbar } from 'reactstrap';
import pluralize from 'pluralize';

import Pagination from 'makeandship-js-common/src/components/ui/pagination';
import PageHeader, {
  styles as pageHeaderStyles,
} from 'makeandship-js-common/src/components/ui/PageHeader';

import styles from './Experiments.scss';
import ExperimentsTable from './ExperimentsTable';
import ExperimentsChoicesFilters from './ExperimentsChoicesFilters';
import Header from '../header/Header';

import UploadButton from '../upload/button/UploadButton';

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
            <ButtonToolbar>
              <Button outline size="sm">
                <i className="fa fa-arrow-circle-down" /> Export
              </Button>
              <div className="pl-2">
                <UploadButton right />
              </div>
            </ButtonToolbar>
          </PageHeader>
          <ExperimentsChoicesFilters />
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
