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
            Sign up
          </h1>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <div>
              Your account has been created, you may now <Link to="/auth/login">log in</Link>
            </div>
            <div className={styles.formActions}>
              <Link className={styles.button} to="/auth/login">
                <span><i className="fa fa-chevron-circle-right" /> Log in</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpSuccess;
