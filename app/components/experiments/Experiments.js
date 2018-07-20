/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Button,
  ButtonToolbar,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';
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
    const placeholder =
      'Search against any metadata field or sequence e.g. GAT';
    return (
      <div className={styles.container}>
        <Header title={'Experiments'} />
        <Container className={styles.headerContainer} fluid>
          <div className={styles.headerContainerInner}>
            <div className={pageHeaderStyles.title}>{title}</div>
            <div className={styles.searchContainer}>
              <Col md={6}>
                <InputGroup>
                  <label className="sr-only" htmlFor="q">
                    {placeholder}
                  </label>
                  <Input
                    type="text"
                    name="q"
                    tabIndex="0"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    role="textbox"
                    placeholder={placeholder}
                    aria-label={placeholder}
                    value={''}
                    onChange={() => {}}
                  />
                  <InputGroupAddon addonType="append">
                    <Button type="submit" color="mid">
                      <i className="fa fa-search" />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
            </div>
          </div>
        </Container>
        <Container fluid>
          <ButtonToolbar className={styles.actionsContainer}>
            <ExperimentsChoicesFilters />
            <div className="ml-3 border-left">
              <Button color="link">
                Actions <i className="fa fa-caret-down" />
              </Button>
            </div>
            <div className="ml-auto">
              <UploadButton right outline={false} />
            </div>
          </ButtonToolbar>
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
