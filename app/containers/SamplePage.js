/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Sample from '../components/sample/Sample';
import withAnalyser from '../hoc/withAnalyser';

import { requestCurrentUser } from '../modules/auth';
import { requestExperiment } from '../modules/analyser';
import { requestTemplate } from '../modules/metadata';

class SamplePage extends React.Component {
  componentDidMount() {
    const {
      analyser,
      requestExperiment,
      requestTemplate,
      requestCurrentUser,
    } = this.props;
    const { id } = this.props.match.params;
    if (!analyser.analysing && !analyser.json) {
      requestExperiment(id);
    }

    // re-fetch user details before requesting template
    // this ensures the correct organisation/template is used,
    // as it may have changed since the user logged in
    requestCurrentUser().then(user => {
      requestTemplate(user);
    });
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
      requestTemplate,
      requestCurrentUser,
    },
    dispatch
  );
}

SamplePage.propTypes = {
  match: PropTypes.object.isRequired,
  analyser: PropTypes.object.isRequired,
  requestExperiment: PropTypes.func.isRequired,
  requestTemplate: PropTypes.func.isRequired,
  requestCurrentUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withAnalyser(SamplePage)
);
