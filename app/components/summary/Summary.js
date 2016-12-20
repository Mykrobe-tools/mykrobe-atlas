/* @flow */

import React, { Component } from 'react';
import styles from './Summary.css';
import ResistanceProfile from '../resistance/ResistanceProfile';
import Panel from '../ui/Panel';
import Key from '../header/Key';
import SummaryMetadata from './SummaryMetadata';
import SummaryVariants from './SummaryVariants';

class Summary extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Key single />
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
          <Panel title="Variants Inducing Resistance" columns={4}>
            <SummaryVariants />
          </Panel>
        </div>
      </div>
    );
  }
}

export default Summary;
