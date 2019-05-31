/* @flow */

import withExperiment from '../../../hoc/withExperiment';
import withFileUpload from '../../../hoc/withFileUpload';
import withPhylogenyNode from '../../../hoc/withPhylogenyNode';

import Analysis from './Analysis';

export default withExperiment(withFileUpload(withPhylogenyNode(Analysis)));
