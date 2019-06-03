/* @flow */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getExperiment,
  getExperimentTransformed,
  getExperimentNearestNeigbours,
  getExperimentsTree,
  getExperimentAndNearestNeigbours,
  getExperimentIsolateId,
  newExperiment,
  createExperiment,
  requestExperiment,
  updateExperiment,
  deleteExperiment,
  requestExperimentMetadataTemplate,
  getExperimentOwnerIsCurrentUser,
  getExperimentMetadata,
  getExperimentMetadataFormCompletion,
  getExperimentMetadataCompletion,
} from '../modules/experiments';

const withExperiment = connect(
  state => ({
    experiment: getExperiment(state),
    experimentTransformed: getExperimentTransformed(state),
    experimentNearestNeigbours: getExperimentNearestNeigbours(state),
    experimentsTree: getExperimentsTree(state),
    experimentAndNearestNeigbours: getExperimentAndNearestNeigbours(state),
    experimentIsolateId: getExperimentIsolateId(state),
    experimentOwnerIsCurrentUser: getExperimentOwnerIsCurrentUser(state),
    experimentMetadataFormCompletion: getExperimentMetadataFormCompletion(
      state
    ),
    experimentMetadataCompletion: getExperimentMetadataCompletion(state),
    experimentMetadata: getExperimentMetadata(state),
  }),
  {
    newExperiment,
    createExperiment,
    requestExperiment,
    updateExperiment,
    deleteExperiment,
    requestExperimentMetadataTemplate,
  }
);

export const withExperimentPropTypes = {
  experiment: PropTypes.object,
  experimentTransformed: PropTypes.object,
  experimentNearestNeigbours: PropTypes.array,
  experimentsTree: PropTypes.object,
  experimentAndNearestNeigbours: PropTypes.array,
  experimentIsolateId: PropTypes.string,
  newExperiment: PropTypes.func,
  createExperiment: PropTypes.func,
  requestExperiment: PropTypes.func,
  updateExperiment: PropTypes.func,
  deleteExperiment: PropTypes.func,
  requestExperimentMetadataTemplate: PropTypes.func,
  experimentOwnerIsCurrentUser: PropTypes.bool,
  experimentMetadataFormCompletion: PropTypes.object,
  experimentMetadataCompletion: PropTypes.object,
  experimentMetadata: PropTypes.any,
};

export default withExperiment;
