/* @flow */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sample from '../components/sample/Sample';
import * as AnalyserActions from '../actions/AnalyserActions';
import * as MetadataActions from '../actions/MetadataActions';
import type { AuthType } from '../types/AuthTypes';
import type { UserType } from '../types/UserTypes';

class SamplePage extends Component {
  componentDidMount() {
    const {analyser, fetchExperiment, fetchTemplate} = this.props;
    const {id} = this.props.params;
    const auth: AuthType = this.props.auth;
    const user: ?UserType = auth.user;
    if (!analyser.analysing && !analyser.json) {
      fetchExperiment(id);
    }
    if (user) {
      fetchTemplate(user);
    }
  }

  render() {
    return (
      <Sample {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchExperiment: AnalyserActions.fetchExperiment,
    fetchTemplate: MetadataActions.fetchTemplate
  }, dispatch);
}

SamplePage.propTypes = {
  auth: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  analyser: PropTypes.object.isRequired,
  fetchExperiment: PropTypes.func.isRequired,
  fetchTemplate: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SamplePage);
