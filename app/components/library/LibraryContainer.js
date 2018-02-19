/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Library from './Library';

import {
  fetchExperiments,
  getExperiments,
  getIsFetchingExperiments,
  fetchFilterValues,
  getFilterValues,
  getIsFetchingFilters,
} from '../../modules/experiments';

class LibraryContainer extends React.Component {
  componentDidMount() {
    const { fetchExperiments } = this.props;
    fetchExperiments();
  }

  render() {
    const {
      fetchExperiments,
      fetchFilterValues,
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
        fetchFilterValues={fetchFilterValues}
        fetchExperiments={fetchExperiments}
      />
    );
  }
}

LibraryContainer.propTypes = {
  experiments: PropTypes.object.isRequired,
  filterValues: PropTypes.array.isRequired,
  fetchExperiments: PropTypes.func.isRequired,
  fetchFilterValues: PropTypes.func.isRequired,
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
      fetchExperiments,
      fetchFilterValues,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LibraryContainer);
