/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ExperimentNavigation from './ExperimentNavigation';
import ExperimentRoutes from './ExperimentRoutes';

import { requestCurrentUser } from '../../modules/users';
import {
  requestExperiment,
  requestExperimentMetadataTemplate,
  getExperiment,
  getExperimentsTree,
  getIsFetchingExperimentsTree,
  requestExperimentsTree,
} from '../../modules/experiments';

import styles from './ExperimentContainer.scss';

class ExperimentContainer extends React.Component<*> {
  // TODO: move these into a saga side effect that watches LOCATION_CHANGE
  // and fetches tree if not loaded, on first experiment request

  requestExperiment = () => {
    const {
      requestExperiment,
      requestExperimentMetadataTemplate,
      experimentsTree,
    } = this.props;
    const { experimentId } = this.props.match.params;
    requestExperiment(experimentId);
    requestExperimentMetadataTemplate();
    if (!experimentsTree) {
      requestExperimentsTree();
    }
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
    const { match, experiment } = this.props;
    return (
      <div className={styles.container}>
        <ExperimentNavigation match={match} experiment={experiment} />
        <ExperimentRoutes match={match} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    experiment: getExperiment(state),
    experimentsTree: getExperimentsTree(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      requestExperiment,
      requestExperimentMetadataTemplate,
      requestCurrentUser,
      requestExperimentsTree,
    },
    dispatch
  );
}

ExperimentContainer.propTypes = {
  match: PropTypes.object.isRequired,
  requestExperiment: PropTypes.func.isRequired,
  requestExperimentMetadataTemplate: PropTypes.func.isRequired,
  experiment: PropTypes.object,
  experimentsTree: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperimentContainer);
