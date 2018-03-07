/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './Upload.css';
import AnimatedBackground from '../animatedbackground/AnimatedBackground';
import CircularProgress from '../ui/CircularProgress';
import Logo from '../logo/Logo';
import * as UIHelpers from '../../helpers/UIHelpers';

class Upload extends React.Component<*> {
  onOpenClick = () => {
    const { analyseFile } = this.props;
    const filePath = UIHelpers.openFileDialog();
    if (filePath) {
      analyseFile(filePath);
    }
  };

  onCancelClick = () => {
    const { analyseFileCancel } = this.props;
    analyseFileCancel();
  };

  renderContentDefault = () => {
    return (
      <div className={styles.content}>
        <div className={styles.logoWrap}>
          <Logo width={192} />
        </div>
        <div className={styles.title}>
          Antimicrobial resistance information within minutes
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.button}
            onClick={this.onOpenClick}
            data-tid="button-analyse-sample"
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
        {0 === progress || 100 === progress ? (
          <div className={styles.dots}>
            <div className={styles.dotOne} />
            <div className={styles.dotTwo} />
            <div className={styles.dotThree} />
          </div>
        ) : (
          <div className={styles.progressTitle}>{analyser.progress}%</div>
        )}
        <CircularProgress percentage={progress} />
        <div className={styles.progressStatus} data-tid="status-text">
          {statusText}
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.button}
            onClick={this.onCancelClick.bind(this)}
            data-tid="button-analyse-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { analyser } = this.props;
    return (
      <div className={styles.container} data-tid="component-upload">
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
