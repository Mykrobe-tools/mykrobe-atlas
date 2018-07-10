/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './ResistanceProfile.css';
import ResistanceEmpty from '../empty/ResistanceEmpty';

class ResistanceProfile extends React.Component<*> {
  render() {
    const { experimentTransformed } = this.props;
    const { hasResistance } = experimentTransformed;
    if (!hasResistance) {
      return (
        <div className={styles.empty} data-tid="component-resistance-profile">
          <ResistanceEmpty />
        </div>
      );
    }
    const { resistant, susceptible, inconclusive } = experimentTransformed;
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
  experiment: PropTypes.object.isRequired,
  experimentTransformed: PropTypes.object.isRequired,
};

export default ResistanceProfile;
