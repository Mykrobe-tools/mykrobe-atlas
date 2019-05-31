/* @flow */

import { connect } from 'react-redux';

import withExperiment from '../../../hoc/withExperiment';
import withFileUpload from '../../../hoc/withFileUpload';
import Analysis from './Analysis';

import {
  getHighlighted,
  setNodeHighlighted,
  unsetNodeHighlightedAll,
} from '../../../modules/phylogeny';

const withRedux = connect(
  state => ({
    highlighted: getHighlighted(state),
  }),
  {
    setNodeHighlighted,
    unsetNodeHighlightedAll,
  }
);

export default withExperiment(withFileUpload(withRedux(Analysis)));
