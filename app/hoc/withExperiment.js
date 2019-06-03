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
} from '../modules/experiments';

const withExperiment = connect(
  state => ({
    experiment: getExperiment(state),
    experimentTransformed: getExperimentTransformed(state),
    experimentNearestNeigbours: getExperimentNearestNeigbours(state),
    experimentsTree: getExperimentsTree(state),
    experimentAndNearestNeigbours: getExperimentAndNearestNeigbours(state),
    experimentIsolateId: getExperimentIsolateId(state),
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
};

export default withExperiment;
