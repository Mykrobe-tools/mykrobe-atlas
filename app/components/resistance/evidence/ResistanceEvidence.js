/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './ResistanceEvidence.css';
import Panel from '../../ui/Panel';

// TODO: push route on state change

class ResistanceEvidence extends React.Component {
  render() {
    const { analyser } = this.props;
    const { evidence } = analyser.transformed;
    let panels = [];
    for (let title in evidence) {
      const values = evidence[title][0];
      panels.push(
        <Panel key={panels.length} title={title} columns={4}>
          <div className={styles.evidence}>
            {values.map((value, index) => <div key={index}>{value}</div>)}
          </div>
        </Panel>
      );
    }
    return <div className={styles.container}>{panels}</div>;
  }
}

ResistanceEvidence.propTypes = {
  analyser: PropTypes.object.isRequired,
};

export default ResistanceEvidence;
