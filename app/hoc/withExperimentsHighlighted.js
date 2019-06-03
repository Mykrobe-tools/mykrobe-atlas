/* @flow */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getExperimentsHighlighted,
  setExperimentsHighlighted,
  resetExperimentsHighlighted,
} from '../modules/experiments';

const withExperimentsHighlighted = connect(
  state => ({
    experimentsHighlighted: getExperimentsHighlighted(state),
  }),
  {
    setExperimentsHighlighted,
    resetExperimentsHighlighted,
  }
);

export const withExperimentsHighlightedPropTypes = {
  experimentsHighlighted: PropTypes.array,
  setExperimentsHighlighted: PropTypes.func,
  resetExperimentsHighlighted: PropTypes.func,
};

export default withExperimentsHighlighted;
