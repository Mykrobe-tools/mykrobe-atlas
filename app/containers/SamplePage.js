/* @flow */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sample from '../components/sample/Sample';
import * as AnalyserActions from '../actions/AnalyserActions';
import * as MetadataActions from '../actions/MetadataActions';

class SamplePage extends Component {
  componentDidMount() {
    const {analyser, fetchExperiment, fetchTemplate} = this.props;
    const {id} = this.props.params;
    if (!analyser.analysing && !analyser.json) {
      fetchExperiment(id);
    }
    fetchTemplate(id);
  }

  render() {
    return (
      <Sample {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchExperiment: AnalyserActions.fetchExperiment,
    fetchTemplate: MetadataActions.fetchTemplate
  }, dispatch);
}

SamplePage.propTypes = {
  params: PropTypes.object.isRequired,
  analyser: PropTypes.object.isRequired,
  fetchExperiment: PropTypes.func.isRequired,
  fetchTemplate: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SamplePage);
