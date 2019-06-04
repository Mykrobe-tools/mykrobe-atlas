/* @flow */

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

const getRouteExperimentId = props =>
  props.match && props.match.params.experimentId;

const withFileUploadWithoutRouter = connect((state, ownProps) => ({
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

export const withFileUploadPropTypes = {
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

const withFileUpload = component =>
  withRouter(withFileUploadWithoutRouter(component));

export default withFileUpload;
