import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './ResistanceScreenAll.css';
import ResistanceProfile from 'components/resistance/ResistanceProfile';

class ResistanceScreenAll extends Component {
  render() {
    return (
      <div className={styles.container}>
        <ResistanceProfile />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

ResistanceScreenAll.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(ResistanceScreenAll);
