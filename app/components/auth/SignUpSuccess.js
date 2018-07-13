/* @flow */

import * as React from 'react';

import styles from './Common.scss';

class SignupSuccess extends React.Component<*> {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Account</div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <div>
              Your account has been created, please check your emails for an
              account verification link
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignupSuccess;
