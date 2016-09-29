import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import styles from './Resistance.css';

import * as AnalyserActions from 'actions/AnalyserActions';
import MykrobeConfig from 'api/MykrobeConfig';
import * as TargetConstants from 'constants/TargetConstants';

import * as DemoActions from 'actions/DemoActions';

class Resistance extends Component {

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(DemoActions.loadTreeWithPath('tree.json'));
  }

  render() {
    const {analyser, children} = this.props;
    if ( !analyser.transformed ) {
      return null;
    }
    const config = new MykrobeConfig();
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            Viewing sample :sampleid:
          </div>
          {TargetConstants.SPECIES_TB === config.species ? (
            <div className={styles.navigation}>
              <Link to="results/resistance/all" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>All</Link>
              <Link to="results/resistance/drugs" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Drugs</Link>
              <Link to="results/resistance/species" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Species</Link>
              <Link to="results/resistance/evidence" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Evidence</Link>
            </div>
          ) : (
            <div className={styles.navigation}>
              <Link to="results/resistance/all" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>All</Link>
              <Link to="results/resistance/class" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Class</Link>
              <Link to="results/resistance/evidence" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Evidence</Link>
              <Link to="results/resistance/species" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Species</Link>
            </div>
          )}
        </div>
        {children}
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
