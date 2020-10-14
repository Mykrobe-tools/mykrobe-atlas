/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './ResistanceEvidence.module.scss';
import Panel from '../../../ui/Panel';
import ResistanceEmpty from '../empty/ResistanceEmpty';
import AppDocumentTitle from '../../../ui/AppDocumentTitle';

class ResistanceEvidence extends React.Component<*> {
  documentTitle = () => {
    const { experimentIsolateId } = this.props;
    return (
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

    console.log('evidence', evidence);
    let panels = [];
    Object.entries(evidence).forEach(([title, entries]) => {
      console.log('title', title);
      console.log('entries', entries);
      const lines = entries.flatMap((entry) => entry);
      console.log('values', lines);
      panels.push(
        <Panel key={panels.length} title={title} columns={4}>
          <div className={styles.evidence}>
            {lines.map((line, index) => (
              <div key={index} data-tid="evidence">
                {line}
              </div>
            ))}
          </div>
        </Panel>
      );
    });

    // let panels = [];
    // for (let title in evidence) {
    //   const values = evidence[title][0];
    //   panels.push(
    //     <Panel key={panels.length} title={title} columns={4}>
    //       <div className={styles.evidence}>
    //         {values.map((value, index) => (
    //           <div key={index} data-tid="evidence">
    //             {value}
    //           </div>
    //         ))}
    //       </div>
    //     </Panel>
    //   );
    // }
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
  experiment: PropTypes.object,
  experimentTransformed: PropTypes.object,
};

export default ResistanceEvidence;
