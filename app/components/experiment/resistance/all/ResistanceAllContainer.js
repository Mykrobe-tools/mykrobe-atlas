/* @flow */

import withExperiment from '../../../../hoc/withExperiment';
import withPhylogenyNode from '../../../../hoc/withPhylogenyNode';

import ResistanceAll from './ResistanceAll';

export default withExperiment(withPhylogenyNode(ResistanceAll));
