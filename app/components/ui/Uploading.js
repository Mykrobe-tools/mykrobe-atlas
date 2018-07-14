/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Uploading.scss';

class Uploading extends React.Component<*> {
  render() {
    const { sectionName } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.icon}>
          <i className="fa fa-clock-o fa-3x" />
        </div>
        <h2 className={styles.title}>Uploading</h2>
        <p className={styles.text}>
          {sectionName} will be available here on completion
        </p>
      </div>
    );
  }
}

Uploading.propTypes = {
  sectionName: PropTypes.string.isRequired,
};

export default Uploading;
