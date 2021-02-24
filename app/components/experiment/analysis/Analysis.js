/* @flow */

import * as React from 'react';

import Loading from 'makeandship-js-common/src/components/ui/loading';

import Phylogeny from '../../phylogeny/Phylogeny';
import Uploading from '../../ui/Uploading';

import ExperimentGeographicMap from './ExperimentGeographicMap';
import AppDocumentTitle from '../../ui/AppDocumentTitle';

import { withExperimentPropTypes } from '../../../hoc/withExperiment';
import { withFileUploadPropTypes } from '../../../hoc/withFileUpload';
import { withExperimentsHighlightedPropTypes } from '../../../hoc/withExperimentsHighlighted';

import styles from './Analysis.module.scss';

class Analysis extends React.Component<*> {
  render() {
    const {
      isFetchingExperiment,
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
      experiment,
      experimentDistanceIsSearching,
    } = this.props;
    let content;
    if (isBusyWithCurrentRoute) {
      content = <Uploading sectionName="Analysis" />;
    } else if (isFetchingExperiment) {
      content = <Loading />;
    } else {
      content = (
        <div className={styles.content}>
          <div className={styles.mapAndPhylogenyContainer}>
            <ExperimentGeographicMap
              experiment={experiment}
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
              experimentDistanceIsSearching={experimentDistanceIsSearching}
            />
            <div className={styles.phylogenyContainer}>
              <Phylogeny
                experiment={experiment}
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
                experimentDistanceIsSearching={experimentDistanceIsSearching}
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
