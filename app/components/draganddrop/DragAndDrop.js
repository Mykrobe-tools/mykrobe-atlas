import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './DragAndDrop.css';
import * as UIHelpers from 'helpers/UIHelpers';
import * as AnalyserActions from 'actions/AnalyserActions';
import AnimatedBackground from './AnimatedBackground';
import CircularProgress from './CircularProgress';

class DragAndDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {analyser} = this.props;
    let content;
    if ( analyser.analysing ) {
      const {progress} = analyser;
      let statusText = 'Constructing genome';
      if (0 === progress) {
        statusText = 'Analysing';
      }
      else if (100 === progress) {
        statusText = 'Check species and scan for resistance';
      }
      content = (
        <div className={styles.promptContainer}>
          {(0 === progress || 100 === progress) ? (
            <div className={styles.dots}>
              <div className={styles.dotOne}></div>
              <div className={styles.dotTwo}></div>
              <div className={styles.dotThree}></div>
            </div>
          ) : (
            <div className={styles.progressTitle}>
              {analyser.progress}%
            </div>
          )}
          <CircularProgress percentage={progress} />
          <div className={styles.progressStatus}>
            {statusText}
          </div>
          <div className={styles.buttonContainer}>
            <button type="button" className={styles.button} onClick={this.onCancelClick.bind(this)}>
              Cancel
            </button>
          </div>
        </div>
      );
    }
    else {
      content = (
        <div className={styles.promptContainer}>
          <div className={styles.promptIcon} />
          <div className={styles.progressStatus}>
            Drag file here to analyse
          </div>
          <div className={styles.buttonContainer}>
            <button type="button" className={styles.button} onClick={this.onOpenClick.bind(this)}>
              Browse...
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.container}>
        <AnimatedBackground />
        {content}
      </div>
    );
  }

  onOpenClick(e) {
    console.log('onOpenClick');
    const {dispatch} = this.props;
    const filePath = UIHelpers.openFileDialog();
    if (filePath) {
      dispatch(AnalyserActions.analyseFileWithPath(filePath));
    }
  }

  onCancelClick(e) {
    console.log('onCancelClick');
    const {dispatch} = this.props;
    dispatch(AnalyserActions.analyseFileCancel());
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

DragAndDrop.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(DragAndDrop);
