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

const getRouteExperimentId = (props) =>
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
  progress: PropTypes.number,
  isBusy: PropTypes.bool,
  isBusyWithCurrentRoute: PropTypes.bool,
  checksumProgress: PropTypes.number,
  uploadProgess: PropTypes.number,
  isComputingChecksums: PropTypes.bool,
  isUploading: PropTypes.bool,
  fileName: PropTypes.string,
  experimentId: PropTypes.string,
  routeExperimentId: PropTypes.string,
  match: PropTypes.object,
};

const withFileUpload = (component) =>
  withRouter(withFileUploadWithoutRouter(component));

export default withFileUpload;
