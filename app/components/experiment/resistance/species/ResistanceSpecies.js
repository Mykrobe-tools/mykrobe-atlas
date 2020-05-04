/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './ResistanceSpecies.module.scss';
import Panel from '../../../ui/Panel';
import ResistanceEmpty from '../empty/ResistanceEmpty';
import AppDocumentTitle from '../../../ui/AppDocumentTitle';

class ResistanceSpecies extends React.Component<*> {
  render() {
    const { experimentTransformed, experimentIsolateId } = this.props;
    const { speciesAndLineageString, error } = experimentTransformed;
    const documentTitle = (
      <AppDocumentTitle
        title={[experimentIsolateId, 'Resistance', 'Species']}
      />
    );
    if (!speciesAndLineageString) {
      return (
        <div className={styles.empty} data-tid="component-resistance-species">
          {documentTitle}
          <ResistanceEmpty subtitle={error} />
        </div>
      );
    }
    return (
      <div className={styles.container} data-tid="component-resistance-species">
        {documentTitle}
        <Panel title="Species" columns={8}>
          <div
            className={styles.species}
            dangerouslySetInnerHTML={{ __html: speciesAndLineageString }}
            data-tid="species"
          />
        </Panel>
      </div>
    );
  }
}

ResistanceSpecies.propTypes = {
  experiment: PropTypes.object,
  experimentTransformed: PropTypes.object,
};

export default ResistanceSpecies;
