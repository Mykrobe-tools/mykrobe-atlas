/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './Summary.css';
import Uploading from '../ui/Uploading';
import ResistanceProfile from '../resistance/ResistanceProfile';
import Panel from '../ui/Panel';
import SummaryMetadata from './SummaryMetadata';
import SummaryVariants from './SummaryVariants';

class Summary extends Component {
  render() {
    const {analyser} = this.props;
    let content;
    if (analyser.analysing) {
      content = <Uploading sectionName="Summary" />;
    }
    else {
      content = (
        <div className={styles.content}>
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
    return (
      <div className={styles.container}>
        {content}
      </div>
    );
  }
}

Summary.propTypes = {
  analyser: PropTypes.object
};

export default Summary;
