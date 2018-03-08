/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './ResistanceEvidence.css';
import Panel from '../../ui/Panel';
import ResistanceEmpty from '../empty/ResistanceEmpty';

// TODO: push route on state change

class ResistanceEvidence extends React.Component<*> {
  render() {
    const { analyser } = this.props;
    const { analyser: { transformed: { hasResistance } } } = this.props;
    if (!hasResistance) {
      return <ResistanceEmpty />;
    }
    const { evidence } = analyser.transformed;
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
    return (
      <div
        className={styles.container}
        data-tid="component-resistance-evidence"
      >
        {panels}
      </div>
    );
  }
}

ResistanceEvidence.propTypes = {
  analyser: PropTypes.object.isRequired,
};

export default ResistanceEvidence;
