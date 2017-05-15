/* @flow */

import React from 'react';
import { Link } from 'react-router';

import styles from './Common.css';

class VerifySuccess extends React.Component {

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            Account
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <div className={styles.contentTitle}>
              Verification
            </div>
            <div>
              You have been verified, you may now <Link to="/auth/login">log in</Link>
              <div className={styles.formActions}>
                <Link className={styles.button} to="/auth/login">Log in</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VerifySuccess;
