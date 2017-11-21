/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './ResistanceProfile.css';

class ResistanceProfile extends Component {
  render() {
    const { analyser } = this.props;
    if (!analyser.transformed) {
      return null;
    }
    const { resistant, susceptible, inconclusive } = analyser.transformed;
    return (
      <div className={styles.container}>
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
    return (
      <div className={styles.column}>
        <div className={titleStyle}>
          <i className={`fa ${icon}`} /> {title}
        </div>
        {elements.map(element => {
          return <div key={`ELEMENT_${element}`}>{element}</div>;
        })}
      </div>
    );
  }
}

ResistanceProfile.propTypes = {
  analyser: PropTypes.object.isRequired,
};

export default ResistanceProfile;
