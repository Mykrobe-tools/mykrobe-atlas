/* @flow */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getExperiment,
  getExperimentTransformed,
  getExperimentNearestNeigbours,
  getExperimentsTree,
  getExperimentAndNearestNeigbours,
} from '../modules/experiments';

const withExperiment = connect(state => ({
  experiment: getExperiment(state),
  experimentTransformed: getExperimentTransformed(state),
  experimentNearestNeigbours: getExperimentNearestNeigbours(state),
  experimentsTree: getExperimentsTree(state),
  experimentAndNearestNeigbours: getExperimentAndNearestNeigbours(state),
}));

export const withExperimentPropTypes = {
  experiment: PropTypes.object,
  experimentTransformed: PropTypes.object,
  experimentNearestNeigbours: PropTypes.array,
  experimentsTree: PropTypes.object,
  experimentAndNearestNeigbours: PropTypes.array,
};

export default withExperiment;
