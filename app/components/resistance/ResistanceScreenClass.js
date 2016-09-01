import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute } from 'react-router';
import { connect } from 'react-redux';
import styles from './ResistanceScreenClass.css';

import * as AnalyserActions from 'actions/AnalyserActions';

// TODO: push route on state change

class ResistanceScreenClass extends Component {
  render() {
    return (
      <div>
        ResistanceScreenClass
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

ResistanceScreenClass.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.object
};

export default connect(mapStateToProps)(ResistanceScreenClass);
