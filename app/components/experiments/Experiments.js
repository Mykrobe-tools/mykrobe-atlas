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
import ExperimentsMap from './ExperimentsMap';
import ExperimentsTree from './ExperimentsTree';

import { withExperimentsPropTypes } from '../../hoc/withExperiments';
import { withCurrentUserPropTypes } from '../../hoc/withCurrentUser';
import { withExperimentPropTypes } from '../../hoc/withExperiment';
import { Link } from 'react-router-dom';

type State = {
  selected?: string | Array<string>,
};

// If the user enters and submits a free text query, clear any existing filters
// to start a new search
const CHANGING_QUERY_CLEARS_OTHER_FILTERS = true;

class Experiments extends React.Component<*, State> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  onNewExperiment = (e: any) => {
    e && e.preventDefault();
    const { newExperiment } = this.props;
    newExperiment();
  };

  onDelete = (experiment: any) => {
    const { deleteExperiment } = this.props;
    const isolateId = _get(experiment, 'metadata.sample.isolateId') || 'sample';
    if (!confirm(`Delete ${isolateId}? This cannot be undone.`)) {
      return;
    }
    deleteExperiment(experiment.id);
  };

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

  setSelected = (selected?: string | Array<string>) => {
    this.setState({
      selected,
    });
  };

  render() {
    const {
      location,
      experiments,
      experimentsFilters,
      isFetchingExperiments,
      onChangeListOrder,
      experimentsIsPending,
      experimentsSearchDescription,
      experimentsError,
      experimentsSearchQuery,
      currentUser,
    } = this.props;
    const { pagination, results, total } = experiments;
    const hasTotal = total !== undefined;
    const hasResults = hasTotal && total > 0;
    const title = hasTotal
      ? `${total.toLocaleString()} ${pluralize('Result', total)}`
      : 'Experiments';
    const { selected } = this.state;
    const showCompare = selected && (selected === '*' || selected.length > 1);
    const showMap = location.hash?.startsWith('#map');
    const showTree = location.hash?.startsWith('#tree');
    const showMapAndTree = location.hash?.startsWith('#both');
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
                  tag={Link}
                  to={`${location.pathname}${location.search}`}
                  outline={showMap || showTree || showMapAndTree}
                >
                  List
                </IconButton>
                <IconButton
                  size="sm"
                  icon="globe"
                  tag={Link}
                  to={`${location.pathname}${location.search}#map`}
                  outline={!showMap}
                >
                  Map
                </IconButton>
                <IconButton
                  size="sm"
                  icon="snowflake-o"
                  tag={Link}
                  to={`${location.pathname}${location.search}#tree`}
                  outline={!showTree}
                >
                  Tree
                </IconButton>
                <IconButton
                  size="sm"
                  icon="columns"
                  tag={Link}
                  to={`${location.pathname}${location.search}#both`}
                  outline={!showMapAndTree}
                >
                  Map+Tree
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
            <ExperimentsMap />
          </React.Fragment>
        );
      } else if (showTree) {
        content = (
          <React.Fragment>
            <Container fluid>{headerContent}</Container>
            <ExperimentsTree />
          </React.Fragment>
        );
      } else if (showMapAndTree) {
        content = (
          <React.Fragment>
            <Container fluid>{headerContent}</Container>
            <div className={styles.bothContainer}>
              <ExperimentsMap />
              <ExperimentsTree />
            </div>
          </React.Fragment>
        );
      } else {
        content = (
          <Container fluid>
            {headerContent}
            <ExperimentsTable
              isFetching={isFetchingExperiments}
              experiments={results}
              onDelete={this.onDelete}
              onChangeOrder={onChangeListOrder}
              filters={experimentsFilters}
              selected={selected}
              setSelected={this.setSelected}
              currentUser={currentUser}
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
          {!showMap && !showTree && isFetchingExperiments && (
            <Loading overlay delayed />
          )}
        </div>
        {!showMap && !showTree && <Footer />}
      </div>
    );
  }
}

Experiments.propTypes = {
  ...withExperimentPropTypes,
  ...withExperimentsPropTypes,
  ...withCurrentUserPropTypes,
  onChangeListOrder: PropTypes.func,
  setPage: PropTypes.func,
};

export default Experiments;
