/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './ResistanceAll.css';
import ResistanceProfile from '../profile/ResistanceProfile';
import Panel from '../../ui/Panel';
import Phylogeny from '../../phylogeny/Phylogeny';

class ResistanceAll extends Component {
  render() {
    const { analyser } = this.props;
    return (
      <div className={styles.container}>
        <Panel title="Resistance Profile" columns={IS_ELECTRON ? undefined : 3}>
          <ResistanceProfile analyser={analyser} />
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
  analyser: PropTypes.object.isRequired,
};

export default ResistanceAll;
