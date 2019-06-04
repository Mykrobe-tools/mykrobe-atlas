/* @flow */

import { withRouter } from 'react-router-dom';

import withFileUpload from '../../../hoc/withFileUpload';
import withExperiment from '../../../hoc/withExperiment';

import EditMetadata from './EditMetadata';

export default withRouter(withExperiment(withFileUpload(EditMetadata)));
