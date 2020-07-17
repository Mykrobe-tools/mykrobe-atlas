/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Button,
  ButtonGroup,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from 'reactstrap';
import pluralize from 'pluralize';
import _get from 'lodash.get';

import Pagination from 'makeandship-js-common/src/components/ui/pagination';
import Loading from 'makeandship-js-common/src/components/ui/loading';
import { IconButton } from 'makeandship-js-common/src/components/ui/buttons';

import styles from './Experiments.module.scss';
import ExperimentsTable from './ExperimentsTable';
import ExperimentsChoicesFilters from './ExperimentsChoicesFilters';
import HeaderContainer from '../ui/header/HeaderContainer';
import Footer from '../ui/footer/Footer';
import { notImplemented } from '../../util';

import UploadButton from '../upload/button/UploadButton';
import SearchNavigation from '../ui/search/SearchNavigation';
import Empty from '../ui/Empty';
import ExperimentGeographicMap from '../experiment/analysis/ExperimentGeographicMap';

import { withExperimentsPropTypes } from '../../hoc/withExperiments';
import { withExperimentsHighlightedPropTypes } from '../../hoc/withExperimentsHighlighted';

type State = {
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
    this.state = {};
  }

  onReset = (e: any) => {
    e.preventDefault();
    const { resetExperimentsFilters } = this.props;
    resetExperimentsFilters();
  };

  onSearchSubmit = (q: any) => {
    const { setExperimentsFilters, experimentsFilters } = this.props;
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

  onRetrySearch = () => {
    // TODO: replace with explicit retry action
    const { setExperimentsFilters, experimentsFilters } = this.props;
    setExperimentsFilters({
      ...experimentsFilters,
    });
  };

  onPageClick = (page: number) => {
    const { setExperimentsFilters, experimentsFilters } = this.props;
    setExperimentsFilters({
      ...experimentsFilters,
      page,
    });
  };

  onViewListClick = (e: any) => {
    e && e.preventDefault();
    const { setExperimentsFilters, experimentsFilters } = this.props;
    setExperimentsFilters({
      ...experimentsFilters,
      view: undefined,
    });
  };

  onViewMapClick = (e: any) => {
    e && e.preventDefault();
    const { setExperimentsFilters, experimentsFilters } = this.props;
    setExperimentsFilters({
      ...experimentsFilters,
      view: 'map',
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
      experimentsSearchDescription,
      experimentsError,
      experimentsHighlighted,
      setExperimentsHighlighted,
      resetExperimentsHighlighted,
      experimentsSearchQuery,
      experimentsWithGeolocation,
      experimentsWithoutGeolocation,
      experimentsHighlightedWithGeolocation,
      experimentsHighlightedWithoutGeolocation,
    } = this.props;
    const { pagination, results, total } = experiments;
    const hasTotal = total !== undefined;
    const hasResults = hasTotal && total > 0;
    const title = hasTotal
      ? `${total.toLocaleString()} ${pluralize('Result', total)}`
      : 'Experiments';
    const { selected } = this.state;
    const showCompare = selected && (selected === '*' || selected.length > 1);
    const showMap = _get(experimentsFilters, 'view') === 'map';
    let content;
    if (hasResults) {
      const headerContent = (
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
                    <DropdownItem onClick={notImplemented}>Share</DropdownItem>
                    <DropdownItem onClick={notImplemented}>Delete</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            )}
          </div>
          <div className="ml-auto">
            <div className={styles.actionsContainer}>
              <ButtonGroup>
                <IconButton
                  size="sm"
                  icon="list-ul"
                  onClick={this.onViewListClick}
                  outline={showMap}
                >
                  List
                </IconButton>
                <IconButton
                  size="sm"
                  icon="globe"
                  onClick={this.onViewMapClick}
                  outline={!showMap}
                >
                  Map
                </IconButton>
              </ButtonGroup>
              <div className="ml-2">
                <UploadButton right size="sm" outline={false} />
              </div>
            </div>
          </div>
        </div>
      );
      if (showMap) {
        content = (
          <React.Fragment>
            <Container fluid>{headerContent}</Container>
            <ExperimentGeographicMap
              experiments={results}
              experimentsHighlighted={experimentsHighlighted}
              setExperimentsHighlighted={setExperimentsHighlighted}
              resetExperimentsHighlighted={resetExperimentsHighlighted}
              experimentsWithGeolocation={experimentsWithGeolocation}
              experimentsWithoutGeolocation={experimentsWithoutGeolocation}
              experimentsHighlightedWithGeolocation={
                experimentsHighlightedWithGeolocation
              }
              experimentsHighlightedWithoutGeolocation={
                experimentsHighlightedWithoutGeolocation
              }
            />
          </React.Fragment>
        );
      } else {
        content = (
          <Container fluid>
            {headerContent}
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
        );
      }
    } else if (experimentsIsPending) {
      content = (
        <Empty
          icon={'clock-o'}
          title={`${experimentsSearchDescription} in progress`}
          subtitle={
            'You will see a notification and this page will refresh when the search is complete'
          }
        >
          <Button outline color="mid" onClick={this.onReset}>
            New search
          </Button>
        </Empty>
      );
    } else if (experimentsError) {
      content = (
        <Empty
          icon={'exclamation-circle'}
          title={`${experimentsSearchDescription} returned an error`}
          subtitle={`Error: ${experimentsError.statusText}`}
        >
          <Button outline color="mid" onClick={this.onRetrySearch}>
            Retry search
          </Button>
        </Empty>
      );
    } else if (hasTotal) {
      content = (
        <Empty
          title={`${experimentsSearchDescription} returned no results`}
          subtitle={
            'No experiments containing all your search terms were found'
          }
        >
          <Button outline color="mid" onClick={this.onReset}>
            Clear search
          </Button>
        </Empty>
      );
    } else {
      // no total, so search hasn't returned data yet
    }
    return (
      <div className={styles.container}>
        <HeaderContainer
          title={
            experimentsSearchQuery
              ? `${experimentsSearchQuery}`
              : 'Sample Library'
          }
        />
        <SearchNavigation
          title={title}
          q={experimentsFilters.q}
          placeholder="Metadata · CAGATC · rpoB_S450L · C32T"
          onSubmit={this.onSearchSubmit}
        />
        <div className={styles.resultsContainer}>
          {content}
          {isFetchingExperiments && <Loading overlay />}
        </div>
        <Footer />
      </div>
    );
  }
}

Experiments.propTypes = {
  ...withExperimentsPropTypes,
  ...withExperimentsHighlightedPropTypes,
  onChangeListOrder: PropTypes.func,
  setPage: PropTypes.func,
};

export default Experiments;
