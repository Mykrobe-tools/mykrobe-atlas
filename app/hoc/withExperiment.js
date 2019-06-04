/* @flow */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getExperiment,
  getExperimentTransformed,
  getExperimentNearestNeigbours,
  getExperimentsTree,
  getExperimentsTreeNewick,
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
  getExperimentAndNearestNeigboursInTree,
  getExperimentAndNearestNeigboursNotInTree,
  getExperimentAndNearestNeigboursWithGeolocation,
  getExperimentAndNearestNeigboursWithoutGeolocation,
} from '../modules/experiments';

const withExperiment = connect(
  state => ({
    experiment: getExperiment(state),
    experimentTransformed: getExperimentTransformed(state),
    experimentNearestNeigbours: getExperimentNearestNeigbours(state),
    experimentsTree: getExperimentsTree(state),
    experimentsTreeNewick: getExperimentsTreeNewick(state),
    experimentAndNearestNeigbours: getExperimentAndNearestNeigbours(state),
    experimentIsolateId: getExperimentIsolateId(state),
    experimentOwnerIsCurrentUser: getExperimentOwnerIsCurrentUser(state),
    experimentMetadataFormCompletion: getExperimentMetadataFormCompletion(
      state
    ),
    experimentMetadataCompletion: getExperimentMetadataCompletion(state),
    experimentMetadata: getExperimentMetadata(state),
    experimentAndNearestNeigboursInTree: getExperimentAndNearestNeigboursInTree(
      state
    ),
    experimentAndNearestNeigboursNotInTree: getExperimentAndNearestNeigboursNotInTree(
      state
    ),
    experimentAndNearestNeigboursWithGeolocation: getExperimentAndNearestNeigboursWithGeolocation(
      state
    ),
    experimentAndNearestNeigboursWithoutGeolocation: getExperimentAndNearestNeigboursWithoutGeolocation(
      state
    ),
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
  experimentsTreeNewick: PropTypes.string,
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
  experimentAndNearestNeigboursInTree: PropTypes.array,
  experimentAndNearestNeigboursNotInTree: PropTypes.array,
  experimentAndNearestNeigboursWithGeolocation: PropTypes.array,
  experimentAndNearestNeigboursWithoutGeolocation: PropTypes.array,
};

export default withExperiment;
