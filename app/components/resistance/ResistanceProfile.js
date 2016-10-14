import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './ResistanceProfile.css';

class ResistanceProfile extends Component {
  render() {
    const {analyser} = this.props;
    const {resistant, susceptible, inconclusive} = analyser.transformed.predictor;
    return (
      <div className={styles.container}>
        {this.column(styles.columnTitleSusceptible, 'fa-check-circle', 'Susceptible', susceptible)}
        {this.column(styles.columnTitleResistant, 'fa-exclamation-triangle', 'Resistant', resistant)}
        {this.column(styles.columnTitleInconclusive, 'fa-minus-square', 'Inconclusive', inconclusive)}
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
        {elements.map((element) => {
          return (
            <div key={`ELEMENT_${element}`}>{element}</div>
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

ResistanceProfile.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(ResistanceProfile);
