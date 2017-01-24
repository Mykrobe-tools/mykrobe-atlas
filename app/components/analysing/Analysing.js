/* @flow */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AnalyserActions from '../../actions/AnalyserActions';
import styles from './Analysing.css';
import AnalysingProgressBar from './AnalysingProgressBar';

class Analysing extends Component {
  componentDidMount() {
    const {monitorUpload} = this.props;
    monitorUpload();
  }

  render() {
    const {analyser} = this.props;
    if (IS_ELECTRON) {
      const UIHelpers = require('../../helpers/UIHelpers');
      UIHelpers.setProgress(analyser.progress);
    }
    return (
      <div className={styles.container}>
        {analyser.analysing &&
          <div className={styles.header}>
            <AnalysingProgressBar progress={analyser.progress} onCancel={(e) => this.onCancelClick(e)} />
          </div>
        }
      </div>
    );
  }

  onCancelClick(e: Event) {
    const {analyseFileCancel} = this.props;
    analyseFileCancel();
  }
}

Analysing.propTypes = {
  analyser: PropTypes.object.isRequired,
  monitorUpload: PropTypes.func.isRequired,
  analyseFileCancel: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    monitorUpload: AnalyserActions.monitorUpload,
    analyseFileCancel: AnalyserActions.analyseFileCancel
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Analysing);
