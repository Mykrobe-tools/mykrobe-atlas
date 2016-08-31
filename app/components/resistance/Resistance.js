import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import styles from './Resistance.css';

import * as AnalyserActions from 'actions/AnalyserActions';

class Resistance extends Component {
  render() {
    const {dispatch, analyser, children} = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            Viewing sample :sampleid:
          </div>
          <div className={styles.navigation}>
            <Link to="results/resistance/a" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Screen A</Link>
            <Link to="results/resistance/b" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Screen B</Link>
          </div>
        </div>
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

Resistance.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.object
};

export default connect(mapStateToProps)(Resistance);
