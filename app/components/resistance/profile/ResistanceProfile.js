/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './ResistanceProfile.css';
import ResistanceEmpty from '../empty/ResistanceEmpty';

class ResistanceProfile extends React.Component<*> {
  render() {
    const { analyser } = this.props;
    if (!analyser || !analyser.transformed) {
      return null;
    }
    const { analyser: { transformed: { hasResistance } } } = this.props;
    if (!hasResistance) {
      return (
        <div className={styles.empty} data-tid="component-resistance-profile">
          <ResistanceEmpty />
        </div>
      );
    }
    const { resistant, susceptible, inconclusive } = analyser.transformed;
    return (
      <div className={styles.container} data-tid="component-resistance-profile">
        {this.column(
          styles.columnTitleSusceptible,
          'fa-check-circle',
          'Susceptible',
          susceptible
        )}
        {this.column(
          styles.columnTitleResistant,
          'fa-exclamation-triangle',
          'Resistant',
          resistant
        )}
        {this.column(
          styles.columnTitleInconclusive,
          'fa-minus-square',
          'Inconclusive',
          inconclusive
        )}
      </div>
    );
  }

  column(titleStyle, icon, title, elements) {
    if (!elements || !elements.length) {
      return null;
    }
    const tid = `column-${title.toLowerCase()}`;
    return (
      <div className={styles.column} data-tid={tid}>
        <div className={titleStyle}>
          <i className={`fa ${icon}`} /> {title}
        </div>
        {elements.map(element => {
          return (
            <div key={`ELEMENT_${element}`} data-tid="drug">
              {element}
            </div>
          );
        })}
      </div>
    );
  }
}

ResistanceProfile.propTypes = {
  analyser: PropTypes.object.isRequired,
};

export default ResistanceProfile;
