/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './ResistanceSpecies.scss';
import Panel from '../../../ui/Panel';
import ResistanceEmpty from '../empty/ResistanceEmpty';

class ResistanceSpecies extends React.Component<*> {
  render() {
    const { experimentTransformed } = this.props;
    const { speciesPretty, error } = experimentTransformed;
    if (!speciesPretty) {
      return (
        <div className={styles.empty} data-tid="component-resistance-species">
          <ResistanceEmpty subtitle={error} />
        </div>
      );
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
