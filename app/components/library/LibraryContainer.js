/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Library from './Library';

import {
  requestExperiments,
  requestExperimentsMetadataChoices,
  getExperiments,
  getExperimentsMetadataChoices,
  getIsFetchingExperiments,
  requestFilterValues,
  getFilterValues,
  getIsFetchingFilters,
} from '../../modules/experiments';

class LibraryContainer extends React.Component<*> {
  componentDidMount() {
    const {
      requestExperiments,
      requestExperimentsMetadataChoices,
    } = this.props;
    requestExperiments();
    requestExperimentsMetadataChoices();
  }

  render() {
    const {
      requestExperiments,
      requestFilterValues,
      experiments,
      isFetchingExperiments,
      filterValues,
      isFetchingFilters,
      experimentsMetadataChoices,
      requestExperimentsMetadataChoices,
    } = this.props;
    return (
      <Library
        experiments={experiments}
        experimentsMetadataChoices={experimentsMetadataChoices}
        isFetchingExperiments={isFetchingExperiments}
        filterValues={filterValues}
        isFetchingFilters={isFetchingFilters}
        requestFilterValues={requestFilterValues}
        requestExperiments={requestExperiments}
        requestExperimentsMetadataChoices={requestExperimentsMetadataChoices}
      />
    );
  }
}

LibraryContainer.propTypes = {
  experiments: PropTypes.object.isRequired,
  experimentsMetadataChoices: PropTypes.object,
  filterValues: PropTypes.array.isRequired,
  requestExperiments: PropTypes.func.isRequired,
  requestFilterValues: PropTypes.func.isRequired,
  isFetchingExperiments: PropTypes.bool.isRequired,
  isFetchingFilters: PropTypes.bool.isRequired,
  requestExperimentsMetadataChoices: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    experiments: getExperiments(state),
    experimentsMetadataChoices: getExperimentsMetadataChoices(state),
    isFetchingExperiments: getIsFetchingExperiments(state),
    filterValues: getFilterValues(state),
    isFetchingFilters: getIsFetchingFilters(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      requestExperiments,
      requestExperimentsMetadataChoices,
      requestFilterValues,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LibraryContainer);
