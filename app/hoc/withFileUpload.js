/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  getIsBusy,
  getProgress,
  getChecksumProgress,
  getUploadProgress,
  getIsComputingChecksums,
  getIsUploading,
  getFileName,
  getExperimentId,
} from '../modules/upload';

function withFileUpload(WrappedComponent: React.ElementProps<*>) {
  class WithFileUpload extends React.Component<*> {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  WithFileUpload.displayName = `WithFileUpload(${getDisplayName(
    WrappedComponent
  )})`;

  const getRouteExperimentId = props =>
    props.match && props.match.params.experimentId;

  const withRedux = connect((state, ownProps) => ({
    progress: getProgress(state),
    isBusy: getIsBusy(state),
    checksumProgress: getChecksumProgress(state),
    uploadProgess: getUploadProgress(state),
    isComputingChecksums: getIsComputingChecksums(state),
    isUploading: getIsUploading(state),
    fileName: getFileName(state),
    experimentId: getExperimentId(state),
    routeExperimentId: getRouteExperimentId(ownProps),
    isBusyWithCurrentRoute:
      getIsBusy(state) &&
      getExperimentId(state) === getRouteExperimentId(ownProps),
  }));

  WithFileUpload.propTypes = {
    progress: PropTypes.number.isRequired,
    isBusy: PropTypes.bool.isRequired,
    isBusyWithCurrentRoute: PropTypes.bool.isRequired,
    checksumProgress: PropTypes.number.isRequired,
    uploadProgess: PropTypes.number.isRequired,
    isComputingChecksums: PropTypes.bool.isRequired,
    isUploading: PropTypes.bool.isRequired,
    fileName: PropTypes.string,
    experimentId: PropTypes.string,
    routeExperimentId: PropTypes.string,
    match: PropTypes.object.isRequired,
  };

  return withRedux(withRouter(WithFileUpload));
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withFileUpload;
