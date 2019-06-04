/* @flow */

import withExperiment from '../../../../hoc/withExperiment';
import withExperimentsHighlighted from '../../../../hoc/withExperimentsHighlighted';

import ResistanceAll from './ResistanceAll';

export default withExperimentsHighlighted(withExperiment(ResistanceAll));
