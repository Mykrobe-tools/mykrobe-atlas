import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './DragAndDrop.css';
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
    if (analyser.analysing) {
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
              <div className={styles.dotOne} />
              <div className={styles.dotTwo} />
              <div className={styles.dotThree} />
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
          <input
            ref={(ref) => { this._fileInput = ref; }}
            onChange={(e) => {
              this.fileInputChanged(e);
            }}
            type="file"
            accept=".json,.bam,.gz,.fastq"
            style={{position: 'fixed', top: '-100em'}}
          />
        </div>
      );
    }
    return (
      <div className={styles.container}>
        <AnimatedBackground />
        <div className={styles.contentContainer}>
          {content}
        </div>
      </div>
    );
  }

  onOpenClick(e) {
    console.log('onOpenClick');
    this._fileInput.click();
  }

  fileInputChanged(e) {
    const {dispatch} = this.props;
    console.log('fileInputChanged', e);
    console.log('this._fileInput.files', this._fileInput.files);
    if (this._fileInput.files && this._fileInput.files.length > 0) {
      const file = this._fileInput.files[0];
      if (file) {
        dispatch(AnalyserActions.analyseFile(file));
      }
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
