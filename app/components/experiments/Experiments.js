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
import SearchInput from '../ui/SearchInput';

type State = {
  q: ?string,
};

class Experiments extends React.Component<*, State> {
  onNewExperiment = e => {
    e && e.preventDefault();
    const { newExperiment } = this.props;
    newExperiment();
  };

  constructor(props: any) {
    super(props);
    this.state = {
      q: props.experimentsFilters.q,
    };
  }

  componentDidUpdate = (prevProps: any) => {
    if (prevProps.experimentsFilters.q !== this.props.experimentsFilters.q) {
      this.setState({
        q: this.props.experimentsFilters.q,
      });
    }
  };

  onChange = (e: any) => {
    const q = e.target.value;
    this.setState({
      q,
    });
  };

  onSubmit = (e: any) => {
    e.preventDefault();
    const { setExperimentsFilters, experimentsFilters } = this.props;
    let { q } = this.state;
    // clear the parameter when empty string
    if (typeof q === 'string' && q.length === 0) {
      q = undefined;
    }
    setExperimentsFilters({
      ...experimentsFilters,
      q,
      page: undefined,
    });
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
    const { q } = this.state;
    return (
      <div className={styles.container}>
        <Header title={'Experiments'} />
        <Container className={styles.headerContainer} fluid>
          <div className={styles.headerContainerInner}>
            <div className={pageHeaderStyles.title}>{title}</div>
            <div className={styles.searchContainer}>
              <Col md={6}>
                <SearchInput
                  value={q}
                  placeholder="Search against any metadata field or sequence e.g. GAT"
                  onChange={this.onChange}
                  onSubmit={this.onSubmit}
                />
              </Col>
            </div>
          </div>
        </Container>
        <Container fluid>
          <div className={styles.actionsContainer}>
            <div className={styles.filtersActionsContainer}>
              <ExperimentsChoicesFilters />
              <div className="ml-3 border-left">
                <Button color="link">
                  Actions <i className="fa fa-caret-down" />
                </Button>
              </div>
            </div>
            <div className="ml-auto">
              <UploadButton right outline={false} />
            </div>
          </div>
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
  setExperimentsFilters: PropTypes.func,
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
