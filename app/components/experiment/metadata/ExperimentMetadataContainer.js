/* @flow */

import * as React from 'react';

import ExperimentMetadataNavigationContainer from './ExperimentMetadataNavigationContainer';
import ExperimentMetadataRoutes from './ExperimentMetadataRoutes';

import withExperiment, {
  withExperimentPropTypes,
} from '../../../hoc/withExperiment';

import styles from './ExperimentMetadataContainer.module.scss';

class ExperimentMetadataContainer extends React.Component<*> {
  render() {
    const {
      experimentMetadataFormCompletion,
      experimentMetadataCompletion,
    } = this.props;
    // there is no form data and completion if it is unmodified, so fall back to pristine data
    const completion = experimentMetadataFormCompletion.complete
      ? experimentMetadataFormCompletion
      : experimentMetadataCompletion;
    return (
      <div className={styles.container}>
        <ExperimentMetadataNavigationContainer completion={completion} />
        <ExperimentMetadataRoutes />
      </div>
    );
  }
}

ExperimentMetadataContainer.propTypes = {
  ...withExperimentPropTypes,
};

export default withExperiment(ExperimentMetadataContainer);
