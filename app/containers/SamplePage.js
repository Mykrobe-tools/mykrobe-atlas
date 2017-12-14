/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';

import AnalysisContainer from '../components/analysis/AnalysisContainer';
import Metadata from '../components/metadata/Metadata';
import Resistance from '../components/resistance/resistance/Resistance';
import SummaryContainer from '../components/summary/SummaryContainer';

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
    const { id } = this.props.match.params;
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
    const { match, analyser } = this.props;
    const { id } = match.params;
    return (
      <Sample {...this.props}>
        <Switch>
          <Route
            exact
            path={match.url}
            component={() => <Redirect to={`${match.url}/metadata`} />}
          />
          <Route
            path={`${match.url}/metadata`}
            component={Metadata}
            analyser={analyser}
            id={id}
          />
          <Route path={`${match.url}/resistance`} component={Resistance} />
          <Route path={`${match.url}/analysis`} component={AnalysisContainer} />
          <Route path={`${match.url}/summary`} component={SummaryContainer} />
        </Switch>
      </Sample>
    );
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
  match: PropTypes.object.isRequired,
  analyser: PropTypes.object.isRequired,
  fetchExperiment: PropTypes.func.isRequired,
  fetchTemplate: PropTypes.func.isRequired,
  fetchCurrentUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SamplePage);
