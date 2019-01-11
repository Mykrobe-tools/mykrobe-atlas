/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getExperiment,
  getExperimentTransformed,
} from '../modules/experiments';

function withExperiment(WrappedComponent: React.ElementProps<*>) {
  class WithExperiment extends React.Component<*> {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  WithExperiment.displayName = `WithExperiment(${getDisplayName(
    WrappedComponent
  )})`;

  const withRedux = connect(state => ({
    experiment: getExperiment(state),
    experimentTransformed: getExperimentTransformed(state),
  }));

  WithExperiment.propTypes = {
    experiment: PropTypes.object,
    experimentTransformed: PropTypes.object,
  };

  return withRedux(WithExperiment);
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withExperiment;
