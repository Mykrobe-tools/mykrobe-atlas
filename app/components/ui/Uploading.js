/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Uploading.module.scss';

class Uploading extends React.Component<*> {
  render() {
    const {
      sectionName,
      isBusyWithCurrentRoute,
      experimentIsAnalysing,
    } = this.props;
    const title = isBusyWithCurrentRoute
      ? 'Uploading'
      : experimentIsAnalysing
      ? 'Analysing'
      : 'Complete';
    return (
      <div className={styles.container}>
        <div className={styles.icon}>
          <i className="fa fa-clock-o fa-3x" />
        </div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.text}>
          {sectionName} will be available here on completion
        </p>
      </div>
    );
  }
}

Uploading.propTypes = {
  sectionName: PropTypes.string,
  experimentIsAnalysing: PropTypes.bool,
};

export default Uploading;
