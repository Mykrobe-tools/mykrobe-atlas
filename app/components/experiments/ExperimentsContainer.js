/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Experiments from './Experiments';

import {
  requestExperiments,
  requestExperimentsMetadataChoices,
  getExperiments,
  getExperimentsMetadataChoices,
  getIsFetchingExperiments,
  getIsFetchingExperimentsMetadataChoices,
} from '../../modules/experiments';

class ExperimentsContainer extends React.Component<*> {
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
      experiments,
      isFetchingExperiments,
      isFetchingExperimentsMetadataChoices,
      experimentsMetadataChoices,
      requestExperimentsMetadataChoices,
    } = this.props;
    return (
      <Experiments
        experiments={experiments}
        experimentsMetadataChoices={experimentsMetadataChoices}
        isFetchingExperiments={isFetchingExperiments}
        isFetchingExperimentsMetadataChoices={
          isFetchingExperimentsMetadataChoices
        }
        requestExperiments={requestExperiments}
        requestExperimentsMetadataChoices={requestExperimentsMetadataChoices}
      />
    );
  }
}

ExperimentsContainer.propTypes = {
  experiments: PropTypes.object.isRequired,
  experimentsMetadataChoices: PropTypes.object,
  requestExperiments: PropTypes.func.isRequired,
  isFetchingExperiments: PropTypes.bool.isRequired,
  isFetchingExperimentsMetadataChoices: PropTypes.bool.isRequired,
  requestExperimentsMetadataChoices: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    experiments: getExperiments(state),
    experimentsMetadataChoices: getExperimentsMetadataChoices(state),
    isFetchingExperiments: getIsFetchingExperiments(state),
    isFetchingExperimentsMetadataChoices: getIsFetchingExperimentsMetadataChoices(
      state
    ),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      requestExperiments,
      requestExperimentsMetadataChoices,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperimentsContainer);
