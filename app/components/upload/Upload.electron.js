/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import styles from './Upload.scss';
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
          <Button
            outline
            size="lg"
            onClick={this.onOpenClick}
            data-tid="button-analyse-sample"
          >
            Analyse Sample
          </Button>
        </div>
      </div>
    );
  };

  renderContentAnalysing = () => {
    const { progress } = this.props;
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
          <div className={styles.progressTitle}>
            {progress}
            <span className={styles.progressTitlePercentSign}>%</span>
          </div>
        )}
        <div className={styles.circularProgressContainer}>
          <CircularProgress
            percentage={progress}
            strokeWidth={100 * (36 / 480)}
            wellWhite
          />
        </div>
        <div className={styles.progressStatus}>
          <div className={styles.progressStatusInner}>
            <div className={styles.title} data-tid="status-text">
              {statusText}
            </div>
            <div className={styles.buttonContainer}>
              <Button
                outline
                size="lg"
                color="mid"
                className={styles.button}
                onClick={this.onCancelClick.bind(this)}
                data-tid="button-analyse-cancel"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { isAnalysing } = this.props;
    return (
      <div className={styles.container} data-tid="component-upload">
        <AnimatedBackground />
        <div className={styles.contentContainer}>
          {isAnalysing
            ? this.renderContentAnalysing()
            : this.renderContentDefault()}
        </div>
      </div>
    );
  }
}

Upload.propTypes = {
  analyseFile: PropTypes.func.isRequired,
  analyseFileCancel: PropTypes.func.isRequired,
  isAnalysing: PropTypes.bool,
  progress: PropTypes.number,
};

export default Upload;
