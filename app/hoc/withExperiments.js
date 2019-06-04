/* @flow */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  requestExperiments,
  requestExperimentsChoices,
  newExperiment,
  getExperiments,
  getExperimentsChoices,
  getExperimentsError,
  getIsFetchingExperiments,
  getIsFetchingExperimentsChoices,
  getExperimentsIsPending,
  getExperimentsFilters,
  setExperimentsFilters,
  resetExperimentsFilters,
  getExperimentsSearchDescription,
  getExperimentsSearchQuery,
  getExperimentsInTree,
  getExperimentsNotInTree,
  getExperimentsWithGeolocation,
  getExperimentsWithoutGeolocation,
} from '../modules/experiments';

const withExperiments = connect(
  state => ({
    experiments: getExperiments(state),
    experimentsChoices: getExperimentsChoices(state),
    isFetchingExperiments: getIsFetchingExperiments(state),
    isFetchingExperimentsChoices: getIsFetchingExperimentsChoices(state),
    experimentsFilters: getExperimentsFilters(state),
    experimentsIsPending: getExperimentsIsPending(state),
    experimentsSearchDescription: getExperimentsSearchDescription(state),
    experimentsError: getExperimentsError(state),
    experimentsSearchQuery: getExperimentsSearchQuery(state),
    experimentsInTree: getExperimentsInTree(state),
    experimentsNotInTree: getExperimentsNotInTree(state),
    experimentsWithGeolocation: getExperimentsWithGeolocation(state),
    experimentsWithoutGeolocation: getExperimentsWithoutGeolocation(state),
  }),
  {
    requestExperiments,
    requestExperimentsChoices,
    setExperimentsFilters,
    resetExperimentsFilters,
    newExperiment,
  }
);

export const withExperimentsPropTypes = {
  experiments: PropTypes.any,
  experimentsChoices: PropTypes.any,
  isFetchingExperiments: PropTypes.bool,
  isFetchingExperimentsChoices: PropTypes.bool,
  experimentsFilters: PropTypes.any,
  experimentsIsPending: PropTypes.bool,
  experimentsSearchDescription: PropTypes.string,
  experimentsError: PropTypes.any,
  requestExperiments: PropTypes.func,
  requestExperimentsChoices: PropTypes.func,
  setExperimentsFilters: PropTypes.func,
  resetExperimentsFilters: PropTypes.func,
  newExperiment: PropTypes.func,
  experimentsSearchQuery: PropTypes.string,
  getExperimentsInTree: PropTypes.array,
  getExperimentsNotInTree: PropTypes.array,
  getExperimentsWithGeolocation: PropTypes.array,
  getExperimentsWithoutGeolocation: PropTypes.array,
};

export default withExperiments;
