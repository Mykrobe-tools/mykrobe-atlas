import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './ResistanceScreenAll.css';
import ResistanceProfile from './ResistanceProfile';
import Phylogeny from './Phylogeny';

class ResistanceScreenAll extends Component {
  render() {
    const {analyser} = this.props;
    return (
      <div className={styles.container}>
        <ResistanceProfile />
        <Phylogeny />
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
