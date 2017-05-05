/* @flow */

import React from 'react';

import styles from './Common.css';

class SignUpSuccess extends React.Component {

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Sign up
          </h1>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <div>
              Your account has been created, please check your emails for an account verification link
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpSuccess;
