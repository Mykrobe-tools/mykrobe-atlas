/* @flow */

import * as React from 'react';
import { withRouter } from 'react-router-dom';

import ExperimentNavigation from './ExperimentNavigation';
import ExperimentRoutes from './ExperimentRoutes';

import withExperiment from '../../hoc/withExperiment';

import styles from './ExperimentContainer.scss';

class ExperimentContainer extends React.Component<*> {
  // TODO: move these into a saga side effect that watches LOCATION_CHANGE

  requestExperiment = () => {
    const { requestExperiment, requestExperimentMetadataTemplate } = this.props;
    const { experimentId } = this.props.match.params;
    requestExperiment(experimentId);
    requestExperimentMetadataTemplate();
  };

  componentDidMount() {
    this.requestExperiment();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.match.params.experimentId !==
      prevProps.match.params.experimentId
    ) {
      this.requestExperiment();
    }
  }

  render() {
    const { match, experimentIsolateId } = this.props;
    return (
      <div className={styles.container}>
        <ExperimentNavigation
          match={match}
          experimentIsolateId={experimentIsolateId}
        />
        <ExperimentRoutes match={match} />
      </div>
    );
  }
}

export default withRouter(withExperiment(ExperimentContainer));
