/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Metadata from 'components/metadata/Metadata';
import styles from './Analysing.css';
import * as AnalyserActions from 'actions/AnalyserActions';
import AnalysingProgressBar from './AnalysingProgressBar';

// TODO: push route on state change

/*
// where win is BrowserWindow
win.setProgressBar(0.5)
win.setRepresentedFilename('/etc/passwd')
const {app} = require('electron')
app.addRecentDocument('/Users/USERNAME/Desktop/work.type')
app.clearRecentDocuments()
*/

class Analysing extends Component {
  render() {
    const {analyser} = this.props;
    if (IS_ELECTRON) {
      const UIHelpers = require('helpers/UIHelpers');
      UIHelpers.setProgress(analyser.progress);
    }
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <AnalysingProgressBar />
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
