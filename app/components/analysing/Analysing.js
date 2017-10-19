/* @flow */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AnalyserActions from '../../actions/AnalyserActions';
import styles from './Analysing.css';
import AnalysingProgressBar from './AnalysingProgressBar';
import * as UIHelpers from '../../helpers/UIHelpers'; // eslint-disable-line import/namespace

class Analysing extends Component {
  componentDidMount() {
    const { monitorUpload } = this.props;
    monitorUpload();
  }

  render() {
    const { analyser } = this.props;
    if (IS_ELECTRON) {
      UIHelpers.setProgress(analyser.progress); // eslint-disable-line import/namespace
    }
    return (
      <div className={styles.container}>
        {analyser.analysing && (
          <AnalysingProgressBar
            progress={analyser.progress}
            description={analyser.stepDescription}
            filename={analyser.filename}
            onCancel={this.onCancelClick}
          />
        )}
      </div>
    );
  }

  onCancelClick = () => {
    const { analyseFileCancel } = this.props;
    analyseFileCancel();
  };
}

Analysing.propTypes = {
  analyser: PropTypes.object.isRequired,
  monitorUpload: PropTypes.func.isRequired,
  analyseFileCancel: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      monitorUpload: AnalyserActions.monitorUpload,
      analyseFileCancel: AnalyserActions.analyseFileCancel,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Analysing);
