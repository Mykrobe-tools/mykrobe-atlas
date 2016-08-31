import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute } from 'react-router';
import { connect } from 'react-redux';
import styles from './PredictorScreenA.css';

import * as AnalyserActions from 'actions/AnalyserActions';

// TODO: push route on state change

class PredictorScreenA extends Component {
  render() {
    return (
      <div>
        Screen A
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

PredictorScreenA.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.object
};

export default connect(mapStateToProps)(PredictorScreenA);
