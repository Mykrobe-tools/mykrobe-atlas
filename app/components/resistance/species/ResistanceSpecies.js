/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './ResistanceSpecies.css';
import Panel from '../../ui/Panel';

class ResistanceSpecies extends React.Component<*> {
  render() {
    const { experimentTransformed } = this.props;
    const { speciesPretty } = experimentTransformed;
    if (!speciesPretty) {
      return null;
    }
    return (
      <div className={styles.container} data-tid="component-resistance-species">
        <Panel title="Species" columns={8}>
          <div
            className={styles.species}
            dangerouslySetInnerHTML={{ __html: speciesPretty }}
            data-tid="species"
          />
        </Panel>
      </div>
    );
  }
}

ResistanceSpecies.propTypes = {
  experiment: PropTypes.object.isRequired,
  experimentTransformed: PropTypes.object.isRequired,
};

export default ResistanceSpecies;
