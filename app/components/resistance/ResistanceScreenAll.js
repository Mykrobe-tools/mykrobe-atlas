import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute } from 'react-router';
import { connect } from 'react-redux';
import styles from './ResistanceScreenAll.css';

import * as AnalyserActions from 'actions/AnalyserActions';

// TODO: push route on state change

class ResistanceScreenAll extends Component {
  render() {
    const {analyser} = this.props;
    const resistant = JSON.stringify(analyser.transformed.resistant, null, 2);
    const susceptible = JSON.stringify(analyser.transformed.susceptible, null, 2);
    const inconclusive = JSON.stringify(analyser.transformed.inconclusive, null, 2);
    return (
      <div className={styles.container}>
        ResistanceScreenAll
        <pre>
          resistant:
          {resistant}
          {'\n'}
          susceptible:
          {susceptible}
          {'\n'}
          inconclusive:
          {inconclusive}
        </pre>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

ResistanceScreenAll.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.object
};

export default connect(mapStateToProps)(ResistanceScreenAll);
