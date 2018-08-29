/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ExperimentMetadataNavigation from './ExperimentMetadataNavigation';
import ExperimentMetadataRoutes from './ExperimentMetadataRoutes';

import { requestCurrentUser } from '../../../modules/users';
import {
  requestExperiment,
  requestExperimentMetadataTemplate,
  getExperimentOwnerIsCurrentUser,
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
    const { match, experimentOwnerIsCurrentUser } = this.props;
    return (
      <div className={styles.container}>
        <ExperimentMetadataNavigation
          match={match}
          experimentOwnerIsCurrentUser={experimentOwnerIsCurrentUser}
        />
        <ExperimentMetadataRoutes match={match} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    experimentOwnerIsCurrentUser: getExperimentOwnerIsCurrentUser(state),
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperimentMetadataContainer);
