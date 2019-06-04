/* @flow */

import * as React from 'react';

import styles from './Analysis.scss';
import Phylogeny from '../../phylogeny/Phylogeny';
import Uploading from '../../ui/Uploading';

import ExperimentGeographicMap from './ExperimentGeographicMap';
import AppDocumentTitle from '../../ui/AppDocumentTitle';

import { withExperimentPropTypes } from '../../../hoc/withExperiment';
import { withFileUploadPropTypes } from '../../../hoc/withFileUpload';
import { withExperimentsHighlightedPropTypes } from '../../../hoc/withExperimentsHighlighted';

class Analysis extends React.Component<*> {
  render() {
    const {
      isBusyWithCurrentRoute,
      experimentsTreeNewick,
      experimentAndNearestNeigbours,
      experimentAndNearestNeigboursInTree,
      experimentAndNearestNeigboursNotInTree,
      experimentAndNearestNeigboursWithGeolocation,
      experimentAndNearestNeigboursWithoutGeolocation,
      experimentIsolateId,
      experimentsHighlighted,
      setExperimentsHighlighted,
      resetExperimentsHighlighted,
      experimentsHighlightedInTree,
      experimentsHighlightedNotInTree,
      experimentsHighlightedWithGeolocation,
      experimentsHighlightedWithoutGeolocation,
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
              experimentsWithGeolocation={
                experimentAndNearestNeigboursWithGeolocation
              }
              experimentsWithoutGeolocation={
                experimentAndNearestNeigboursWithoutGeolocation
              }
              experimentsHighlighted={experimentsHighlighted}
              experimentsHighlightedWithGeolocation={
                experimentsHighlightedWithGeolocation
              }
              experimentsHighlightedWithoutGeolocation={
                experimentsHighlightedWithoutGeolocation
              }
              setExperimentsHighlighted={setExperimentsHighlighted}
              resetExperimentsHighlighted={resetExperimentsHighlighted}
              experimentIsolateId={experimentIsolateId}
            />
            <div className={styles.phylogenyContainer}>
              <Phylogeny
                experimentsTreeNewick={experimentsTreeNewick}
                experiments={experimentAndNearestNeigbours}
                experimentsHighlighted={experimentsHighlighted}
                experimentsHighlightedInTree={experimentsHighlightedInTree}
                experimentsHighlightedNotInTree={
                  experimentsHighlightedNotInTree
                }
                experimentsInTree={experimentAndNearestNeigboursInTree}
                experimentsNotInTree={experimentAndNearestNeigboursNotInTree}
                setExperimentsHighlighted={setExperimentsHighlighted}
                resetExperimentsHighlighted={resetExperimentsHighlighted}
                experimentIsolateId={experimentIsolateId}
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
  ...withFileUploadPropTypes,
  ...withExperimentsHighlightedPropTypes,
};

export default Analysis;
