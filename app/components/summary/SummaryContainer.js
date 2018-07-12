/* @flow */

import Summary from './Summary';
import withExperiment from '../../hoc/withExperiment';
import withFileUpload from '../../hoc/withFileUpload';

export default withExperiment(withFileUpload(Summary));
