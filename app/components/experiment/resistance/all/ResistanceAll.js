/* @flow */

import * as React from 'react';

import ResistanceProfile from '../profile/ResistanceProfile';
import Panel from '../../../ui/Panel';
import AppDocumentTitle from '../../../ui/AppDocumentTitle';
import ResistanceEmpty from '../empty/ResistanceEmpty';
import Phylogeny from '../../../phylogeny/Phylogeny';

import styles from './ResistanceAll.scss';

import { withExperimentPropTypes } from '../../../../hoc/withExperiment';
import { withPhylogenyNodePropTypes } from '../../../../hoc/withPhylogenyNode';

class ResistanceAll extends React.Component<*> {
  render() {
    const {
      experiment,
      experimentAndNearestNeigbours,
      experimentsTree,
      experimentTransformed,
      highlighted,
      setNodeHighlighted,
      unsetNodeHighlightedAll,
      experimentIsolateId,
    } = this.props;
    const { hasResistance, error } = experimentTransformed;
    const documentTitle = IS_ELECTRON ? null : (
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
              experiments={experimentAndNearestNeigbours}
              highlighted={highlighted}
              setNodeHighlighted={setNodeHighlighted}
              unsetNodeHighlightedAll={unsetNodeHighlightedAll}
              experimentsTree={experimentsTree}
              controlsInset={0}
            />
          </Panel>
        )}
      </div>
    );
  }
}

ResistanceAll.propTypes = {
  ...withExperimentPropTypes,
  ...withPhylogenyNodePropTypes,
};

export default ResistanceAll;
