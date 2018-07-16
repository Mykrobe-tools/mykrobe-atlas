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
} from '../../modules/experiments';

import styles from './ExperimentContainer.scss';

class ExperimentContainer extends React.Component<*> {
  componentDidMount() {
    const { requestExperiment, requestExperimentMetadataTemplate } = this.props;
    const { experimentId } = this.props.match.params;
    requestExperiment(experimentId);
    requestExperimentMetadataTemplate();
  }

  render() {
    const { match } = this.props;
    return (
      <div className={styles.container}>
        <ExperimentNavigation match={match} />
        <ExperimentRoutes match={match} />
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

ExperimentContainer.propTypes = {
  match: PropTypes.object.isRequired,
  requestExperiment: PropTypes.func.isRequired,
  requestExperimentMetadataTemplate: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperimentContainer);
