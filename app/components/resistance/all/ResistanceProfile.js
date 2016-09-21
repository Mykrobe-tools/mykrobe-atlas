import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './ResistanceProfile.css';

class ResistanceProfile extends Component {
  render() {
    const {analyser} = this.props;
    const {resistant, susceptible, inconclusive} = analyser.transformed;
    return (
      <div className={styles.container}>
        <div className={styles.title}>Resistance Profile</div>
        <div className={styles.columnContainer}>
          {this.column('Resistant', resistant)}
          {this.column('Susceptible', susceptible)}
          {this.column('Inconclusive', inconclusive)}
        </div>
      </div>
    );
  }

  column(title, elements) {
    if ( !elements || !elements.length ) {
      return null;
    }
    return (
      <div className={styles.column}>
        <div className={styles.columnTitle}>
          {title}
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
