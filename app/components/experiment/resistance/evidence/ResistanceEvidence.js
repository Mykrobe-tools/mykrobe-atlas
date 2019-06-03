/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './ResistanceEvidence.scss';
import Panel from '../../../ui/Panel';
import ResistanceEmpty from '../empty/ResistanceEmpty';
import AppDocumentTitle from '../../../ui/AppDocumentTitle';

class ResistanceEvidence extends React.Component<*> {
  documentTitle = () => {
    const { experimentIsolateId } = this.props;
    return IS_ELECTRON ? null : (
      <AppDocumentTitle
        title={[experimentIsolateId, 'Resistance', 'Evidence']}
      />
    );
  };

  renderEmpty(error: string) {
    return (
      <div className={styles.empty} data-tid="component-resistance-evidence">
        {this.documentTitle()}
        <ResistanceEmpty subtitle={error} />
      </div>
    );
  }

  render() {
    const { experimentTransformed } = this.props;
    const { hasResistance, error } = experimentTransformed;
    if (!hasResistance) {
      return this.renderEmpty(error);
    }
    const { evidence } = experimentTransformed;
    let panels = [];
    for (let title in evidence) {
      const values = evidence[title][0];
      panels.push(
        <Panel key={panels.length} title={title} columns={4}>
          <div className={styles.evidence}>
            {values.map((value, index) => (
              <div key={index} data-tid="evidence">
                {value}
              </div>
            ))}
          </div>
        </Panel>
      );
    }
    if (!panels.length) {
      return this.renderEmpty(error);
    }
    return (
      <div
        className={styles.container}
        data-tid="component-resistance-evidence"
      >
        {this.documentTitle()}
        {panels}
      </div>
    );
  }
}

ResistanceEvidence.propTypes = {
  experiment: PropTypes.object.isRequired,
  experimentTransformed: PropTypes.object.isRequired,
};

export default ResistanceEvidence;
