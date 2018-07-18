/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './UploadProgressBar.scss';

class UploadProgressBar extends React.Component<*> {
  onCancelClick = (e: Event) => {
    const { onCancel } = this.props;
    e && e.preventDefault();
    onCancel();
  };
  render() {
    const { description, progress, filename, experimentId } = this.props;
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
          <span>
            {text}
            <span> &middot; </span>
            <Link to={`/experiments/${experimentId}`} className={styles.view}>
              View
            </Link>
          </span>
          {progress < 100 && (
            <span>
              <span> &middot; </span>
              <a
                href="#"
                onClick={this.onCancelClick}
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

UploadProgressBar.propTypes = {
  filename: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  onCancel: PropTypes.func,
  experimentId: PropTypes.string,
};

export default UploadProgressBar;
