/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from './Analysing.css';
import AnalysingProgressBar from './AnalysingProgressBar';
import * as UIHelpers from '../../helpers/UIHelpers'; // eslint-disable-line import/namespace

import {
  getAnalyser,
  getIsAnalysing,
  getProgress,
  monitorUpload,
  analyseFileCancel,
} from '../../modules/analyser';

class Analysing extends React.Component<*> {
  componentDidMount() {
    const { monitorUpload } = this.props;
    monitorUpload();
  }

  render() {
    const { analyser, isAnalysing, progress } = this.props;
    if (IS_ELECTRON) {
      UIHelpers.setProgress(analyser.progress); // eslint-disable-line import/namespace
    }
    return (
      <div className={styles.container}>
        {isAnalysing && (
          <AnalysingProgressBar
            progress={progress}
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
  isAnalysing: PropTypes.bool.isRequired,
  monitorUpload: PropTypes.func.isRequired,
  analyseFileCancel: PropTypes.func.isRequired,
  progress: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return {
    analyser: getAnalyser(state),
    isAnalysing: getIsAnalysing(state),
    progress: getProgress(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      monitorUpload,
      analyseFileCancel,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Analysing);
