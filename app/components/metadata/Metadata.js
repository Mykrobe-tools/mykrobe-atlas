/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './Metadata.css';

import MetadataForm from './MetadataForm';

class Metadata extends Component {

  render() {
    const {analyser} = this.props;
    return (
      <div className={styles.container}>
        {analyser.analysing &&
          <div className={styles.uploadingMessage}>
            <h2 className={styles.uploadingMessageTitle}>
              Your sample is uploading
            </h2>
            <p className={styles.uploadingMessageText}>
              To help Atlas provide more accurate results, please provide any available metadata
            </p>
          </div>
        }
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <div className={styles.formHeaderTitle}>
              Metadata
            </div>
            <div className={styles.formHeaderActions}>
              <div className={styles.formHeaderAction}>
                Edit
              </div>
            </div>
          </div>
          <MetadataForm />
        </div>
      </div>
    );
  }
}

Metadata.propTypes = {
  analyser: PropTypes.object.isRequired
};

export default Metadata;
