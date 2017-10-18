/* @flow */

import React, { Component, PropTypes } from 'react';
import path from 'path';

import styles from './Upload.css';
import AnimatedBackground from '../animatedbackground/AnimatedBackground';
import CircularProgress from '../ui/CircularProgress';
import Logo from '../logo/Logo';
import * as UIHelpers from '../../helpers/UIHelpers';

class Upload extends Component {
  _dropzone: Element;
  state: {
    isDragActive: boolean,
  };

  constructor(props: Object) {
    super(props);
    this.state = {
      isDragActive: false,
    };
  }

  onOpenClick = () => {
    const { analyseFile } = this.props;
    const filePath = UIHelpers.openFileDialog();
    if (filePath) {
      const fileObject = {
        path: filePath,
        name: path.parse(filePath).base,
      };
      analyseFile(fileObject);
    }
  };

  onCancelClick = () => {
    console.log('onCancelClick');
    const { analyseFileCancel } = this.props;
    analyseFileCancel();
  };

  onDragOver = () => {
    this.setState({
      isDragActive: true,
    });
  };

  onDragLeave = () => {
    this.setState({
      isDragActive: false,
    });
  };

  renderContentDefault = () => {
    return (
      <div className={styles.content}>
        <div className={styles.logoWrap}>
          <div className={styles.logo}>
            <Logo />
          </div>
        </div>
        <div className={styles.title}>
          Outbreak and resistance analysis in minutes
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.button}
            onClick={this.onOpenClick}
          >
            Analyse Sample
          </button>
        </div>
      </div>
    );
  };

  renderContentAnalysing = () => {
    const { analyser } = this.props;
    const { progress } = analyser;
    let statusText = 'Constructing genome';
    if (0 === progress) {
      statusText = 'Analysing';
    } else if (100 === progress) {
      statusText = 'Check species and scan for resistance';
    }
    return (
      <div className={styles.content}>
        {0 === progress || 100 === progress
          ? <div className={styles.dots}>
              <div className={styles.dotOne} />
              <div className={styles.dotTwo} />
              <div className={styles.dotThree} />
            </div>
          : <div className={styles.progressTitle}>{analyser.progress}%</div>}
        <CircularProgress percentage={progress} />
        <div className={styles.progressStatus}>{statusText}</div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.button}
            onClick={this.onCancelClick.bind(this)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { isDragActive } = this.state;
    const { analyser } = this.props;
    return (
      <div
        className={isDragActive ? styles.containerDragActive : styles.container}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
      >
        <AnimatedBackground />
        <div className={styles.contentContainer}>
          {analyser.analysing
            ? this.renderContentAnalysing()
            : this.renderContentDefault()}
        </div>
      </div>
    );
  }
}

Upload.propTypes = {
  analyser: PropTypes.object.isRequired,
  analyseFile: PropTypes.func.isRequired,
  analyseFileCancel: PropTypes.func.isRequired,
};

export default Upload;
