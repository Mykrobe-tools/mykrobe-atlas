import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Metadata from './metadata/Metadata';
import styles from './Analysing.css';

import * as AnalyserActions from 'actions/AnalyserActions';

// TODO: push route on state change

class Analysing extends Component {
  render() {
    const {dispatch, analyser} = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          Analysing... {analyser.progress}%
          <button type="button" onClick={this.onCancelClick.bind(this)}>
            Cancel
          </button>
        </div>
        <Metadata />
      </div>
    );
  }

  onCancelClick(e) {
    const {dispatch} = this.props;
    dispatch(AnalyserActions.analyseFileCancel());
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

Analysing.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Analysing);
