/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './ResistanceSpecies.scss';
import Panel from '../../../ui/Panel';
import ResistanceEmpty from '../empty/ResistanceEmpty';

class ResistanceSpecies extends React.Component<*> {
  renderEmpty() {
    return (
      <div className={styles.empty} data-tid="component-resistance-evidence">
        <ResistanceEmpty />
      </div>
    );
  }

  render() {
    const { experimentTransformed } = this.props;
    const { speciesPretty } = experimentTransformed;
    if (!speciesPretty) {
      return this.renderEmpty();
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
