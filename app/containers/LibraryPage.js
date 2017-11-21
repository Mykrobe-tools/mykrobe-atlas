/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Library from '../components/library/Library';
import * as ExperimentActions from '../actions/ExperimentActions';

class LibraryPage extends React.Component {
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
