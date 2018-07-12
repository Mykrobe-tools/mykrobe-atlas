/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getIsBusy,
  getProgress,
  getChecksumProgress,
  getUploadProgress,
  getIsComputingChecksums,
  getIsUploading,
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

  const withRedux = connect(state => ({
    progress: getProgress(state),
    isBusy: getIsBusy(state),
    checksumProgress: getChecksumProgress(state),
    uploadProgess: getUploadProgress(state),
    isComputingChecksums: getIsComputingChecksums(state),
    isUploading: getIsUploading(state),
  }));

  WithFileUpload.propTypes = {
    progress: PropTypes.number.isRequired,
    isBusy: PropTypes.bool.isRequired,
    checksumProgress: PropTypes.number.isRequired,
    uploadProgess: PropTypes.number.isRequired,
    isComputingChecksums: PropTypes.bool.isRequired,
    isUploading: PropTypes.bool.isRequired,
  };

  return withRedux(WithFileUpload);
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withFileUpload;
