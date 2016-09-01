import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute } from 'react-router';
import { connect } from 'react-redux';
import styles from './ResistanceScreenEvidence.css';

import * as AnalyserActions from 'actions/AnalyserActions';

// TODO: push route on state change

class ResistanceScreenEvidence extends Component {
  render() {
    return (
      <div>
        ResistanceScreenEvidence
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

ResistanceScreenEvidence.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.object
};

export default connect(mapStateToProps)(ResistanceScreenEvidence);
