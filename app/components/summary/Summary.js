import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Summary.css';

class Panel extends Component {
  render() {
    const {title, columns} = this.props;
    return (
      <div className={styles.panelContainer} style={{width: `${100*columns/8}%`}}>
        <div className={styles.panelContent}>
          <div className={styles.panelTitle}>
            {title}
          </div>
        </div>
      </div>
    );
  }
}

Panel.defaultProps = {
  columns: 4
};

class Summary extends Component {
  render() {
    const {children} = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.title}>
          Summary report for sample :sampleid:
        </div>
        <div className={styles.summaryContainer}>
          <Panel title="Metadata" columns={8} />
          <Panel title="Resistance Profile" columns={4} />
          <Panel title="Variants Inducing Resistance" />
        </div>
      </div>
    );
  }
}

export default Summary;
