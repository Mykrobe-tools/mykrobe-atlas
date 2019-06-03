/* @flow */

import * as React from 'react';

import styles from './Analysis.scss';
import Phylogeny from '../../phylogeny/Phylogeny';
import Uploading from '../../ui/Uploading';

import ExperimentGeographicMap from './ExperimentGeographicMap';
import AppDocumentTitle from '../../ui/AppDocumentTitle';

import { withExperimentPropTypes } from '../../../hoc/withExperiment';
import { withPhylogenyNodePropTypes } from '../../../hoc/withPhylogenyNode';
import { withFileUploadPropTypes } from '../../../hoc/withFileUpload';

class Analysis extends React.Component<*> {
  render() {
    const {
      isBusyWithCurrentRoute,
      highlighted,
      setNodeHighlighted,
      unsetNodeHighlightedAll,
      experimentsTree,
      experimentAndNearestNeigbours,
      experimentIsolateId,
    } = this.props;
    let content;
    if (isBusyWithCurrentRoute) {
      content = <Uploading sectionName="Analysis" />;
    } else {
      content = (
        <div className={styles.content}>
          <div className={styles.mapAndPhylogenyContainer}>
            <ExperimentGeographicMap
              experiments={experimentAndNearestNeigbours}
              highlighted={highlighted}
              setNodeHighlighted={setNodeHighlighted}
            />
            <div className={styles.phylogenyContainer}>
              <Phylogeny
                experiments={experimentAndNearestNeigbours}
                highlighted={highlighted}
                setNodeHighlighted={setNodeHighlighted}
                unsetNodeHighlightedAll={unsetNodeHighlightedAll}
                experimentsTree={experimentsTree}
              />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.container}>
        <AppDocumentTitle title={[experimentIsolateId, 'Analysis']} />
        {content}
      </div>
    );
  }
}

Analysis.propTypes = {
  ...withExperimentPropTypes,
  ...withPhylogenyNodePropTypes,
  ...withFileUploadPropTypes,
};

export default Analysis;
