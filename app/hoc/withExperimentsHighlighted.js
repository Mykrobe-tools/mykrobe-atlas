/* @flow */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getExperimentsHighlighted,
  setExperimentsHighlighted,
  resetExperimentsHighlighted,
  getExperimentsHighlightedInTree,
  getExperimentsHighlightedNotInTree,
  getExperimentsHighlightedWithGeolocation,
  getExperimentsHighlightedWithoutGeolocation,
} from '../modules/experiments';

const withExperimentsHighlighted = connect(
  (state) => ({
    experimentsHighlighted: getExperimentsHighlighted(state),
    experimentsHighlightedInTree: getExperimentsHighlightedInTree(state),
    experimentsHighlightedNotInTree: getExperimentsHighlightedNotInTree(state),
    experimentsHighlightedWithGeolocation: getExperimentsHighlightedWithGeolocation(
      state
    ),
    experimentsHighlightedWithoutGeolocation: getExperimentsHighlightedWithoutGeolocation(
      state
    ),
  }),
  {
    setExperimentsHighlighted,
    resetExperimentsHighlighted,
  }
);

export const withExperimentsHighlightedPropTypes = {
  experimentsHighlighted: PropTypes.array,
  experimentsHighlightedInTree: PropTypes.array,
  experimentsHighlightedNotInTree: PropTypes.array,
  experimentsHighlightedWithGeolocation: PropTypes.array,
  experimentsHighlightedWithoutGeolocation: PropTypes.array,
  setExperimentsHighlighted: PropTypes.func,
  resetExperimentsHighlighted: PropTypes.func,
};

export default withExperimentsHighlighted;
