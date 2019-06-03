/* @flow */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import {
  getExperiment,
  getExperimentTransformed,
} from '../modules/experiments';

import { getFileNames } from '../modules/desktop';

// use file names in place of isolateId - TODO: rename this to experimentTitle

export const getDesktopExperimentIsolateId = createSelector(
  getFileNames,
  fileNames => (fileNames && fileNames.length ? fileNames.join(', ') : '–')
);

const withExperiment = connect(state => ({
  experiment: getExperiment(state),
  experimentTransformed: getExperimentTransformed(state),
  experimentIsolateId: getDesktopExperimentIsolateId(state),
}));

export const withExperimentPropTypes = {
  experiment: PropTypes.object,
  experimentTransformed: PropTypes.object,
  experimentIsolateId: PropTypes.string,
};

export default withExperiment;
