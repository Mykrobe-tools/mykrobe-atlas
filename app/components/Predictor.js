import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Analysing.css';

import * as AnalyserActions from '../actions/AnalyserActions';

// TODO: push route on state change

class Predictor extends Component {
  render() {
    const {dispatch, analyser} = this.props;
    return (
      <div>
        <div className={styles.container}>
          <h2>Predictor</h2>
          Show results in here
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

Predictor.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Predictor);
