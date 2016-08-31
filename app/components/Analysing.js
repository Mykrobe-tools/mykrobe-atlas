import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Analysing.css';

import * as AnalyserActions from 'actions/AnalyserActions';

// TODO: push route on state change

class Analysing extends Component {
  render() {
    const {dispatch, analyser} = this.props;
    return (
      <div>
        <div className={styles.container}>
          <h2>Analysing... {analyser.progress}%</h2>
          <button type="button" onClick={this.onCancelClick.bind(this)}>
            Cancel
          </button>
        </div>
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
