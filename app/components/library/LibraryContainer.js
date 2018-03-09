/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Library from './Library';

import {
  requestExperiments,
  getExperiments,
  getIsFetchingExperiments,
  requestFilterValues,
  getFilterValues,
  getIsFetchingFilters,
} from '../../modules/experiments';

class LibraryContainer extends React.Component<*> {
  componentDidMount() {
    const { requestExperiments } = this.props;
    requestExperiments();
  }

  render() {
    const {
      requestExperiments,
      requestFilterValues,
      experiments,
      isFetchingExperiments,
      filterValues,
      isFetchingFilters,
    } = this.props;
    return (
      <Library
        experiments={experiments}
        isFetchingExperiments={isFetchingExperiments}
        filterValues={filterValues}
        isFetchingFilters={isFetchingFilters}
        requestFilterValues={requestFilterValues}
        requestExperiments={requestExperiments}
      />
    );
  }
}

LibraryContainer.propTypes = {
  experiments: PropTypes.object.isRequired,
  filterValues: PropTypes.array.isRequired,
  requestExperiments: PropTypes.func.isRequired,
  requestFilterValues: PropTypes.func.isRequired,
  isFetchingExperiments: PropTypes.bool.isRequired,
  isFetchingFilters: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    experiments: getExperiments(state),
    isFetchingExperiments: getIsFetchingExperiments(state),
    filterValues: getFilterValues(state),
    isFetchingFilters: getIsFetchingFilters(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      requestExperiments,
      requestFilterValues,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LibraryContainer);
