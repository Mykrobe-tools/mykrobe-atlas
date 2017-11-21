/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './ResistanceSpecies.css';
import Panel from '../../ui/Panel';

class ResistanceSpecies extends Component {
  render() {
    const { analyser } = this.props;
    const { speciesPretty } = analyser.transformed;

    return (
      <div className={styles.container}>
        <Panel title="Species" columns={8}>
          <div
            className={styles.species}
            dangerouslySetInnerHTML={{ __html: speciesPretty }}
          />
        </Panel>
      </div>
    );
  }
}

ResistanceSpecies.propTypes = {
  analyser: PropTypes.object.isRequired,
};

export default ResistanceSpecies;
