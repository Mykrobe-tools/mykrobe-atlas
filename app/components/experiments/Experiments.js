/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Button,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from 'reactstrap';
import pluralize from 'pluralize';

import Pagination from 'makeandship-js-common/src/components/ui/pagination';
import Loading from 'makeandship-js-common/src/components/ui/loading';
import { styles as pageHeaderStyles } from 'makeandship-js-common/src/components/ui/PageHeader';

import styles from './Experiments.scss';
import ExperimentsTable from './ExperimentsTable';
import ExperimentsChoicesFilters from './ExperimentsChoicesFilters';
import HeaderContainer from '../header/HeaderContainer';
import Footer from '../footer/Footer';
import { notImplemented } from '../../util';

import UploadButton from '../upload/button/UploadButton';
import SearchInput from '../ui/SearchInput';
import Empty from '../ui/Empty';

type State = {
  q: ?string,
  selected?: string | Array<string>,
};

// If the user enters and submits a free text query, clear any existing filters
// to start a new search
const CHANGING_QUERY_CLEARS_OTHER_FILTERS = true;

class Experiments extends React.Component<*, State> {
  onNewExperiment = (e: any) => {
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

  onReset = (e: any) => {
    e.preventDefault();
    const { resetExperimentsFilters } = this.props;
    resetExperimentsFilters();
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
    if (q && CHANGING_QUERY_CLEARS_OTHER_FILTERS) {
      setExperimentsFilters({
        q,
      });
    } else {
      setExperimentsFilters({
        ...experimentsFilters,
        q,
        page: undefined,
      });
    }
  };

  onPageClick = (page: number) => {
    const { setExperimentsFilters, experimentsFilters } = this.props;
    setExperimentsFilters({
      ...experimentsFilters,
      page,
    });
  };

  setSelected = (selected?: string | Array<string>) => {
    this.setState({
      selected,
    });
  };

  render() {
    const {
      experiments,
      experimentsFilters,
      isFetchingExperiments,
      onChangeListOrder,
      experimentsIsPending,
    } = this.props;
    const { pagination, results, total } = experiments;
    const hasTotal = total !== undefined;
    const hasResults = hasTotal && total > 0;
    const title = hasTotal
      ? `${total.toLocaleString()} ${pluralize('Result', total)}`
      : 'Experiments';
    const { q, selected } = this.state;
    const showCompare = selected && (selected === '*' || selected.length > 1);
    return (
      <div className={styles.container}>
        <HeaderContainer title={'Sample Library'} />
        <Container className={styles.headerContainer} fluid>
          <div className={styles.headerContainerInner}>
            <div className={pageHeaderStyles.title}>{title}</div>
            <div className={styles.searchContainer}>
              <Col md={6}>
                <SearchInput
                  value={q}
                  placeholder="Metadata · CAGATC · rpoB_S450L · C32T"
                  onChange={this.onChange}
                  onSubmit={this.onSubmit}
                />
              </Col>
            </div>
          </div>
        </Container>
        {hasResults ? (
          <div className={styles.resultsContainer}>
            <Container fluid>
              <div className={styles.actionsContainer}>
                <div className={styles.filtersActionsContainer}>
                  <ExperimentsChoicesFilters size="sm" />
                  {selected && (
                    <div className="ml-3 border-left">
                      <UncontrolledDropdown>
                        <DropdownToggle
                          color="link"
                          size={'sm'}
                          data-tid="actions-dropdown-toggle"
                        >
                          Actions <i className="fa fa-caret-down" />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem disabled>
                            {selected === '*'
                              ? `${total.toLocaleString()} selected`
                              : `${selected.length} selected`}
                          </DropdownItem>
                          <DropdownItem divider />
                          {showCompare && (
                            <DropdownItem onClick={notImplemented}>
                              Compare
                            </DropdownItem>
                          )}
                          <DropdownItem onClick={notImplemented}>
                            Share
                          </DropdownItem>
                          <DropdownItem onClick={notImplemented}>
                            Delete
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                  )}
                </div>
                <div className="ml-auto">
                  <UploadButton right size="sm" outline={false} />
                </div>
              </div>
              <ExperimentsTable
                isFetching={isFetchingExperiments}
                experiments={results}
                onChangeOrder={onChangeListOrder}
                filters={experimentsFilters}
                selected={selected}
                setSelected={this.setSelected}
              />
              {pagination && (
                <Pagination
                  first={1}
                  last={pagination.pages}
                  current={pagination.page}
                  onPageClick={this.onPageClick}
                />
              )}
            </Container>
            {isFetchingExperiments && <Loading overlay />}
          </div>
        ) : experimentsIsPending ? (
          <div className={styles.resultsContainer}>
            <Empty
              icon={'clock-o'}
              title={'Search in progress'}
              subtitle={
                'You will see a notification and this page will refresh when the search is complete'
              }
            >
              <Button outline color="mid" onClick={this.onReset}>
                New search
              </Button>
            </Empty>
          </div>
        ) : (
          <div className={styles.resultsContainer}>
            <Empty
              title={'No results'}
              subtitle={
                'No experiments containing all your search terms were found'
              }
            >
              <Button outline color="mid" onClick={this.onReset}>
                Clear search
              </Button>
            </Empty>
            {isFetchingExperiments && <Loading overlay />}
          </div>
        )}
        <Footer />
      </div>
    );
  }
}

Experiments.propTypes = {
  experiments: PropTypes.object.isRequired,
  experimentsFilters: PropTypes.any,
  setExperimentsFilters: PropTypes.func,
  resetExperimentsFilters: PropTypes.func,
  requestExperiments: PropTypes.func,
  requestFilterValues: PropTypes.func,
  isFetchingExperiments: PropTypes.bool,
  isFetchingFilters: PropTypes.bool,
  onChangeListOrder: PropTypes.func,
  setPage: PropTypes.func,
  newExperiment: PropTypes.func,
  experimentsIsPending: PropTypes.bool,
};

export default Experiments;
