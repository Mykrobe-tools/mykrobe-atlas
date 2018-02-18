/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Library from './Library';

import { fetchExperiments, getExperiments } from '../../modules/experiments';

class LibraryContainer extends React.Component {
  componentDidMount() {
    const { fetchExperiments } = this.props;
    fetchExperiments();
  }

  render() {
    const { experiments } = this.props;
    return <Library experiments={experiments} />;
  }
}

LibraryContainer.propTypes = {
  experiments: PropTypes.object.isRequired,
  fetchExperiments: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    experiments: getExperiments(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchExperiments: fetchExperiments,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LibraryContainer);
