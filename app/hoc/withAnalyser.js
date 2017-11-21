/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function withAnalyser(WrappedComponent) {
  class WithAnalyser extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  WithAnalyser.displayName = `WithAnalyser(${getDisplayName(
    WrappedComponent
  )})`;

  const withRedux = connect(state => ({
    analyser: state.analyser,
  }));

  WithAnalyser.propTypes = {
    analyser: PropTypes.object.isRequired,
  };

  return withRedux(WithAnalyser);
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAnalyser;
