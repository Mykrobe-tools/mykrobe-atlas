/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getExperiment,
  getExperimentTransformed,
  getExperimentNearestNeigbours,
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
    experimentNearestNeigbours: getExperimentNearestNeigbours(state),
  }));

  WithExperiment.propTypes = {
    experiment: PropTypes.object,
    experimentTransformed: PropTypes.object,
    experimentNearestNeigbours: PropTypes.array,
  };

  return withRedux(WithExperiment);
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withExperiment;
