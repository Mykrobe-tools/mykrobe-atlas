import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import styles from './Predictor.css';

import * as AnalyserActions from 'actions/AnalyserActions';

class Predictor extends Component {
  render() {
    const {dispatch, analyser, children} = this.props;
    return (
      <div className={styles.container}>
        <h2>Predictor</h2>
        Show results in here
        <ul>
          <li><Link to="results/predictor/a" activeClassName="active">Screen A</Link></li>
          <li><Link to="results/predictor/b" activeClassName="active">Screen B</Link></li>
        </ul>
        <div>
          {children}
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
  children: PropTypes.object
};

export default connect(mapStateToProps)(Predictor);
