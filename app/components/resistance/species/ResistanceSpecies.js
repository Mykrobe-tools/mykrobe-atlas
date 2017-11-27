/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './ResistanceSpecies.css';
import Panel from '../../ui/Panel';

class ResistanceSpecies extends React.Component {
  render() {
    const { analyser } = this.props;
    const { speciesPretty } = analyser.transformed;

    return (
      <div className={styles.container} data-tid="component-resistance-species">
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
