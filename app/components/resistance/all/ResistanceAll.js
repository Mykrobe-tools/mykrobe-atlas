/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './ResistanceAll.css';
import ResistanceProfile from '../profile/ResistanceProfile';
import Panel from '../../ui/Panel';
import ResistanceEmpty from '../empty/ResistanceEmpty';
import Phylogeny from '../../phylogeny/Phylogeny';

class ResistanceAll extends React.Component<*> {
  render() {
    const { experiment, experimentTransformed } = this.props;
    const { hasResistance } = experimentTransformed;
    if (!hasResistance) {
      return (
        <div className={styles.empty} data-tid="component-resistance-all">
          <ResistanceEmpty data-tid="component-resistance-all" />
        </div>
      );
    }
    return (
      <div className={styles.container} data-tid="component-resistance-all">
        <Panel title="Resistance Profile" columns={IS_ELECTRON ? undefined : 3}>
          <ResistanceProfile
            experiment={experiment}
            experimentTransformed={experimentTransformed}
          />
        </Panel>
        {!IS_ELECTRON && (
          <Panel title="Phylogeny" columns={5}>
            <Phylogeny controlsInset={0} />
          </Panel>
        )}
      </div>
    );
  }
}

ResistanceAll.propTypes = {
  experiment: PropTypes.object.isRequired,
  experimentTransformed: PropTypes.object.isRequired,
};

export default ResistanceAll;
