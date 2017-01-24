/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './AnalysingProgressBar.css';

class AnalysingProgressBar extends Component {
  render() {
    const {progress, onCancel} = this.props;
    const progressBarContainerStyle = {
      width: `${progress}%`
    };
    var text = `Analysing ${progress}%`;
    if (progress === 100) {
      text = 'Check species and scan for resistance';
    }
    return (
      <div className={styles.container}>
        <div className={styles.progressBarContainer} style={progressBarContainerStyle}>
          <div className={progress > 20 ? styles.progressBarLabelInside : styles.progressBarLabelOutside}>
            {text}
            {progress < 100 &&
              <span>
                <span> - </span>
                <a href="#" onClick={event => onCancel(event)} className={progress > 20 ? styles.cancelInside : styles.cancelOutside}>
                  Cancel
                </a>
              </span>
            }
          </div>
        </div>
      </div>
    );
  }
}

AnalysingProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default AnalysingProgressBar;
