/* @flow */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Library from '../components/library/Library';
import * as ExperimentActions from '../actions/ExperimentActions';

class LibraryPage extends Component {
  componentDidMount() {
    const { fetchExperiments } = this.props;
    fetchExperiments();
  }

  render() {
    return <Library {...this.props} />;
  }
}

LibraryPage.propTypes = {
  fetchExperiments: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    experiments: state.experiments,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchExperiments: ExperimentActions.fetchExperiments,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LibraryPage);
