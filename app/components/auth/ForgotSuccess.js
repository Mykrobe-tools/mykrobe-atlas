/* @flow */

import React from 'react';
import { Link } from 'react-router';

import styles from './Common.css';

class SignUpSuccess extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Account</div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <div className={styles.contentTitle}>Forgot password</div>
            <div>Password reset instructions have been sent</div>
            <div className={styles.formActions}>
              <Link className={styles.button} to="/">
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpSuccess;
