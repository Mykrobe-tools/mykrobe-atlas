/* @flow */

import withExperiment from '../../../hoc/withExperiment';
import withFileUpload from '../../../hoc/withFileUpload';
import withPhylogenyNode from '../../../hoc/withPhylogenyNode';
import withExperimentsHighlighted from '../../../hoc/withExperimentsHighlighted';

import Analysis from './Analysis';

export default withExperimentsHighlighted(
  withExperiment(withFileUpload(withPhylogenyNode(Analysis)))
);
