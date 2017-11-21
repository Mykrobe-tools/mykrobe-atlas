/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './AnalysingProgressBar.css';

class AnalysingProgressBar extends React.Component {
  render() {
    const { description, progress, filename, onCancel } = this.props;
    var text = `${description} ${filename} ${progress}%`;
    if (progress === 100) {
      text = 'Check species and scan for resistance';
    }
    return (
      <div className={styles.container}>
        <div
          className={styles.progressBarContainer}
          style={{ width: `${progress}%` }}
        />
        <div className={styles.progressBarLabel}>
          {text}
          {progress < 100 && (
            <span>
              <span> &middot; </span>
              <a
                href="#"
                onClick={event => onCancel(event)}
                className={styles.cancel}
              >
                Cancel
              </a>
            </span>
          )}
        </div>
      </div>
    );
  }
}

AnalysingProgressBar.propTypes = {
  filename: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AnalysingProgressBar;
