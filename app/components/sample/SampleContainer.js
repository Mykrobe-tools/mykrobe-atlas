/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Sample from '../../components/sample/Sample';
import withFileUpload from '../../hoc/withFileUpload';

import { requestCurrentUser } from '../../modules/users';
import {
  requestExperiment,
  requestExperimentMetadataTemplate,
} from '../../modules/experiments';

class SampleContainer extends React.Component<*> {
  componentDidMount() {
    const {
      requestExperiment,
      requestExperimentMetadataTemplate,
      isBusy,
    } = this.props;
    const { id } = this.props.match.params;
    if (!isBusy) {
      requestExperiment(id);
    }
    requestExperimentMetadataTemplate();
  }

  render() {
    const { match } = this.props;
    return <Sample match={match} />;
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

SampleContainer.propTypes = {
  match: PropTypes.object.isRequired,
  isBusy: PropTypes.bool.isRequired,
  requestExperiment: PropTypes.func.isRequired,
  requestExperimentMetadataTemplate: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFileUpload(SampleContainer));
