/* @flow */

import React from 'react';
import { Link } from 'react-router';

import styles from './Common.css';

class SignUpSuccess extends React.Component {

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Forgot password
          </h1>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <div>
              Password reset instructions have been sent
            </div>
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
