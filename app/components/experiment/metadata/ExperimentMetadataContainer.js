/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ExperimentMetadataNavigationContainer from './ExperimentMetadataNavigationContainer';
import ExperimentMetadataRoutes from './ExperimentMetadataRoutes';

import { requestCurrentUser } from '../../../modules/users';
import {
  requestExperiment,
  requestExperimentMetadataTemplate,
  getExperimentOwnerIsCurrentUser,
  getExperimentMetadataFormCompletion,
  getExperimentMetadataCompletion,
} from '../../../modules/experiments';

import styles from './ExperimentMetadataContainer.scss';

class ExperimentMetadataContainer extends React.Component<*> {
  componentDidMount() {
    // experiment is requested by ExperimentContainer
    // const { requestExperiment, requestExperimentMetadataTemplate } = this.props;
    // const { experimentId } = this.props.match.params;
    // requestExperiment(experimentId);
    // requestExperimentMetadataTemplate();
  }

  render() {
    const {
      match,
      experimentOwnerIsCurrentUser,
      experimentMetadataFormCompletion,
      experimentMetadataCompletion,
    } = this.props;
    // there is no form data and completion if it is unmodified, so fall back to pristine data
    const completion = experimentMetadataFormCompletion.complete
      ? experimentMetadataFormCompletion
      : experimentMetadataCompletion;
    return (
      <div className={styles.container}>
        <ExperimentMetadataNavigationContainer
          match={match}
          experimentOwnerIsCurrentUser={experimentOwnerIsCurrentUser}
          completion={completion}
        />
        <ExperimentMetadataRoutes match={match} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    experimentOwnerIsCurrentUser: getExperimentOwnerIsCurrentUser(state),
    experimentMetadataFormCompletion: getExperimentMetadataFormCompletion(
      state
    ),
    experimentMetadataCompletion: getExperimentMetadataCompletion(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      requestExperiment,
      requestExperimentMetadataTemplate,
      requestCurrentUser,
    },
    dispatch
  );
}

ExperimentMetadataContainer.propTypes = {
  match: PropTypes.object.isRequired,
  requestExperiment: PropTypes.func.isRequired,
  requestExperimentMetadataTemplate: PropTypes.func.isRequired,
  experimentOwnerIsCurrentUser: PropTypes.bool,
  experimentMetadataFormCompletion: PropTypes.object.isRequired,
  experimentMetadataCompletion: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperimentMetadataContainer);
