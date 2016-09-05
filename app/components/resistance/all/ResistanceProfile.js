import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './ResistanceProfile.css';

class ResistanceProfile extends Component {
  render() {
    const {analyser} = this.props;
    const resistant = JSON.stringify(analyser.transformed.resistant, null, 2);
    const susceptible = JSON.stringify(analyser.transformed.susceptible, null, 2);
    const inconclusive = JSON.stringify(analyser.transformed.inconclusive, null, 2);
    return (
      <div className={styles.container}>
        ResistanceProfile
        <pre>
          resistant:
          {resistant}
          {'\n'}
          susceptible:
          {susceptible}
          {'\n'}
          inconclusive:
          {inconclusive}
        </pre>
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
