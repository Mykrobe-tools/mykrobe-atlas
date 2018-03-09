/* @flow */

import * as React from 'react';
import { Link } from 'react-router-dom';

import styles from './Common.css';

class SignUpSuccess extends React.Component<*> {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Reset Password</div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <div>Your password has been reset</div>
            <div className={styles.formActions}>
              <Link to="/">Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpSuccess;
