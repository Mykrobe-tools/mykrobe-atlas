import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Summary.css';
import ResistanceProfile from 'components/resistance/ResistanceProfile';
import Panel from  'components/ui/Panel';
import SummaryMetadata from './SummaryMetadata';

class Summary extends Component {
  render() {
    const {children} = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.title}>
          Summary report for sample :sampleid:
        </div>
        <div className={styles.summaryContainer}>
          <Panel title="Metadata" columns={8}>
            <SummaryMetadata />
          </Panel>
          <Panel title="Resistance Profile" columns={4}>
            <ResistanceProfile />
          </Panel>
          <Panel title="Variants Inducing Resistance" />
        </div>
      </div>
    );
  }
}

export default Summary;
