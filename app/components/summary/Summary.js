import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Summary.css';

class SummaryPanel extends Component {
  render() {
    const {title} = this.props;
    return (
      <div className={styles.panelContainer}>
        <div className={styles.panelContent}>
          {title}
        </div>
      </div>
    );
  }
}

class Summary extends Component {
  render() {
    const {children} = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.title}>
          Summary
        </div>
        <div className={styles.summaryContainer}>
          <SummaryPanel title="Metadata" />
          <SummaryPanel title="Resistance Profile" />
          <SummaryPanel title="Variants Inducing Resistance" />
        </div>
      </div>
    );
  }
}

export default Summary;
