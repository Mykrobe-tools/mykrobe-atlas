/* @flow */

import * as React from 'react';

import Uploading from '../../ui/Uploading';
import ResistanceProfile from '../resistance/profile/ResistanceProfile';
import Panel from '../../ui/Panel';
import SummaryMetadata from './SummaryMetadata';
import SummaryVariants from './SummaryVariants';
import AppDocumentTitle from '../../ui/AppDocumentTitle';

import { withExperimentPropTypes } from '../../../hoc/withExperiment';
import { withFileUploadPropTypes } from '../../../hoc/withFileUpload';

import styles from './Summary.module.scss';

class Summary extends React.Component<*> {
  render() {
    const {
      experiment,
      experimentTransformed,
      experimentNearestNeigbours,
      isBusyWithCurrentRoute,
      experimentIsolateId,
      experimentDistanceIsSearching,
      experimentIsAnalysing,
    } = this.props;
    let content;
    if (isBusyWithCurrentRoute || experimentIsAnalysing) {
      content = (
        <Uploading
          sectionName="Summary"
          isBusyWithCurrentRoute={isBusyWithCurrentRoute}
          experimentIsAnalysing={experimentIsAnalysing}
        />
      );
    } else {
      content = (
        <div className={styles.summaryContainer}>
          <div className={styles.topRow}>
            <Panel title="Metadata" columns={8}>
              <SummaryMetadata
                experiment={experiment}
                experimentTransformed={experimentTransformed}
                experimentNearestNeigbours={experimentNearestNeigbours}
                experimentDistanceIsSearching={experimentDistanceIsSearching}
              />
            </Panel>
          </div>
          <div className={styles.bottomRow}>
            <Panel title="Resistance Profile" columns={4}>
              <ResistanceProfile
                experiment={experiment}
                experimentTransformed={experimentTransformed}
              />
            </Panel>
            <Panel title="Variants Inducing Resistance" columns={4}>
              <SummaryVariants
                experiment={experiment}
                experimentTransformed={experimentTransformed}
              />
            </Panel>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.container}>
        <AppDocumentTitle title={[experimentIsolateId, 'Summary']} />
        {content}
      </div>
    );
  }
}

Summary.propTypes = {
  ...withExperimentPropTypes,
  ...withFileUploadPropTypes,
};

export default Summary;
