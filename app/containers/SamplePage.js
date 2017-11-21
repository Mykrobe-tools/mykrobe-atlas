/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sample from '../components/sample/Sample';
import * as AuthActions from '../actions/AuthActions';
import * as AnalyserActions from '../actions/AnalyserActions';
import * as MetadataActions from '../actions/MetadataActions';

class SamplePage extends React.Component {
  componentDidMount() {
    const {
      analyser,
      fetchExperiment,
      fetchTemplate,
      fetchCurrentUser,
    } = this.props;
    const { id } = this.props.params;
    if (!analyser.analysing && !analyser.json) {
      fetchExperiment(id);
    }

    // re-fetch user details before requesting template
    // this ensures the correct organisation/template is used,
    // as it may have changed since the user logged in
    fetchCurrentUser().then(user => {
      fetchTemplate(user);
    });
  }

  render() {
    return <Sample {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchExperiment: AnalyserActions.fetchExperiment,
      fetchTemplate: MetadataActions.fetchTemplate,
      fetchCurrentUser: AuthActions.fetchCurrentUser,
    },
    dispatch
  );
}

SamplePage.propTypes = {
  params: PropTypes.object.isRequired,
  analyser: PropTypes.object.isRequired,
  fetchExperiment: PropTypes.func.isRequired,
  fetchTemplate: PropTypes.func.isRequired,
  fetchCurrentUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SamplePage);
