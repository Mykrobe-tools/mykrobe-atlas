/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './SummaryVariants.css';

class SummaryVariants extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.group}>
          <div className={styles.title}>Isoniazid</div>
          <div>Resistance mutation found: S315W in gene katG</div>
          <div>Resistant allele seen 22 times</div>
          <div>Susceptible allele seen 0 times</div>
          <div>High Confidence call – 97% PPV</div>
        </div>
        <div className={styles.group}>
          <div className={styles.title}>Whole genome analysis</div>
          <div>Depth of coverage 80&times</div>
          <div>No evidence of multiple strains (only 2 heterozygous sites)</div>
          <div><a href="#"><i className="fa fa-plus-circle" /> more</a></div>
        </div>
        <div className={styles.group}>
          <div className={styles.title}>Contamination check</div>
          <div>Minor contamination (3%) from M. abscessus</div>
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

SummaryVariants.propTypes = {
  analyser: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(SummaryVariants);
