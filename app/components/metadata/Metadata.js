/* @flow */

import React, { Component } from 'react';
import styles from './Metadata.css';

import MetadataForm from './MetadataForm';

class Metadata extends Component {

  render() {
    return (
      <div className={styles.container}>
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

export default Metadata;
