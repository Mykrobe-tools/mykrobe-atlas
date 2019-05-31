/* @flow */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getHighlighted,
  setNodeHighlighted,
  unsetNodeHighlightedAll,
} from '../modules/phylogeny';

const withPhylogenyNode = connect(
  state => ({
    highlighted: getHighlighted(state),
  }),
  {
    setNodeHighlighted,
    unsetNodeHighlightedAll,
  }
);

export const withPhylogenyNodePropTypes = {
  highlighted: PropTypes.array,
  setNodeHighlighted: PropTypes.func,
  unsetNodeHighlightedAll: PropTypes.func,
};

export default withPhylogenyNode;
