/* @flow */

/* TODO Refactor to use redux-form */
/* eslint-disable react/no-string-refs */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './Common.css';
import {
  signIn,
  getFailureReason,
  deleteFailureReason,
} from '../../modules/auth';

import type { UserType } from '../../types/UserTypes';

class Login extends React.Component {
  handleSubmit(e) {
    e.preventDefault();
    const { signIn } = this.props;

    const userObject: UserType = {
      email: this.refs.email.value,
      password: this.refs.password.value,
    };

    signIn(userObject);
  }

  componentWillUnmount() {
    const { deleteFailureReason } = this.props;
    deleteFailureReason();
  }

  render() {
    const { failureReason } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Account</div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <div className={styles.contentTitle}>Log in</div>
            <form onSubmit={e => this.handleSubmit(e)}>
              {failureReason && (
                <div className={styles.formErrors}>{failureReason}</div>
              )}
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="email">
                  Email
                </label>
                <input
                  className={styles.input}
                  autoFocus
                  type="email"
                  id="email"
                  ref="email"
                  placeholder="sam.smith@example.com"
                  defaultValue=""
                  data-tid="input-email"
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="password">
                  Password
                </label>
                <input
                  className={styles.input}
                  type="password"
                  id="password"
                  ref="password"
                  data-tid="input-password"
                />
              </div>
              <div className={styles.formActions}>
                <button
                  className={styles.button}
                  type="submit"
                  data-tid="button-submit"
                >
                  <span>
                    <i className="fa fa-chevron-circle-right" /> Log in
                  </span>
                </button>
                <div>
                  <Link className={styles.buttonBorderless} to="/auth/signup">
                    Sign up
                  </Link>
                </div>
                <div>
                  <Link className={styles.buttonBorderless} to="/auth/forgot">
                    Forgot password
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    failureReason: getFailureReason(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      signIn: signIn,
      deleteFailureReason: deleteFailureReason,
    },
    dispatch
  );
}

Login.propTypes = {
  failureReason: PropTypes.string,
  signIn: PropTypes.func.isRequired,
  deleteFailureReason: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
