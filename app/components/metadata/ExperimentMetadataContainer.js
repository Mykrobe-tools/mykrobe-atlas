/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ExperimentMetadataNavigation from './ExperimentMetadataNavigation';
import ExperimentMetadataRoutes from './ExperimentMetadataRoutes';

import { requestCurrentUser } from '../../modules/users';
import {
  requestExperiment,
  requestExperimentMetadataTemplate,
} from '../../modules/experiments';

import styles from './ExperimentMetadataContainer.scss';

class ExperimentMetadataContainer extends React.Component<*> {
  componentDidMount() {
    // const { requestExperiment, requestExperimentMetadataTemplate } = this.props;
    // const { experimentId } = this.props.match.params;
    // requestExperiment(experimentId);
    // requestExperimentMetadataTemplate();
  }

  render() {
    const { match } = this.props;
    return (
      <div className={styles.container}>
        <ExperimentMetadataNavigation match={match} />
        <ExperimentMetadataRoutes match={match} />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperimentMetadataContainer);
