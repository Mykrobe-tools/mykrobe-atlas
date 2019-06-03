/* @flow */

import { withRouter } from 'react-router-dom';

import withFileUpload from '../../../hoc/withFileUpload';
import withExperiment from '../../../hoc/withExperiment';

import ExperimentMetadataNavigation from './ExperimentMetadataNavigation';

export default withRouter(
  withExperiment(withFileUpload(ExperimentMetadataNavigation))
);
