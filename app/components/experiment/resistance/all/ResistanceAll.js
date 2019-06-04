/* @flow */

import * as React from 'react';

import ResistanceProfile from '../profile/ResistanceProfile';
import Panel from '../../../ui/Panel';
import AppDocumentTitle from '../../../ui/AppDocumentTitle';
import ResistanceEmpty from '../empty/ResistanceEmpty';
import Phylogeny from '../../../phylogeny/Phylogeny';

import styles from './ResistanceAll.scss';

import { withExperimentPropTypes } from '../../../../hoc/withExperiment';
import { withExperimentsHighlightedPropTypes } from '../../../../hoc/withExperimentsHighlighted';

class ResistanceAll extends React.Component<*> {
  render() {
    const {
      experiment,
      experimentInTree,
      experimentNotInTree,
      experimentsTreeNewick,
      experimentTransformed,
      experimentIsolateId,
      experimentsHighlighted,
      setExperimentsHighlighted,
      resetExperimentsHighlighted,
      experimentsHighlightedInTree,
      experimentsHighlightedNotInTree,
    } = this.props;
    const { hasResistance, error } = experimentTransformed;
    const documentTitle = (
      <AppDocumentTitle title={[experimentIsolateId, 'Resistance', 'All']} />
    );
    if (!hasResistance) {
      return (
        <div className={styles.empty} data-tid="component-resistance-all">
          {documentTitle}
          <ResistanceEmpty subtitle={error} />
        </div>
      );
    }
    return (
      <div className={styles.container} data-tid="component-resistance-all">
        {documentTitle}
        <Panel title="Resistance Profile" columns={IS_ELECTRON ? undefined : 3}>
          <ResistanceProfile
            experiment={experiment}
            experimentTransformed={experimentTransformed}
          />
        </Panel>
        {!IS_ELECTRON && (
          <Panel title="Phylogeny" columns={5}>
            <Phylogeny
              controlsInset={0}
              experimentsTreeNewick={experimentsTreeNewick}
              experiments={[experiment]}
              experimentsHighlighted={experimentsHighlighted}
              experimentsHighlightedInTree={experimentsHighlightedInTree}
              experimentsHighlightedNotInTree={experimentsHighlightedNotInTree}
              experimentsInTree={experimentInTree}
              experimentsNotInTree={experimentNotInTree}
              setExperimentsHighlighted={setExperimentsHighlighted}
              resetExperimentsHighlighted={resetExperimentsHighlighted}
              experimentIsolateId={experimentIsolateId}
            />
          </Panel>
        )}
      </div>
    );
  }
}

ResistanceAll.propTypes = {
  ...withExperimentPropTypes,
  ...withExperimentsHighlightedPropTypes,
};

export default ResistanceAll;
