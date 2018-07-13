/* @flow */

/* TODO Refactor to use redux-form */
/* eslint-disable react/no-string-refs */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './Common.scss';
import type { AuthResetPasswordType } from '../../types/AuthTypes';

import {
  getError,
  resetPassword,
} from 'makeandship-js-common/src/modules/auth';

class Reset extends React.Component<*> {
  handleSubmit(e) {
    e.preventDefault();
    const { resetPassword } = this.props;
    const { resetPasswordToken } = this.props.match.params;

    const userObject: AuthResetPasswordType = {
      resetPasswordToken: resetPasswordToken,
      password: this.refs.password.value,
    };
    resetPassword(userObject);
  }

  render() {
    const { error } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Reset Password</div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <form
              onSubmit={e => {
                this.handleSubmit(e);
              }}
            >
              {error && (
                <div className={styles.formErrors}>{error.message}</div>
              )}
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="password">
                  Password
                </label>
                <input
                  className={styles.input}
                  autoFocus
                  type="password"
                  id="password"
                  ref="password"
                />
              </div>
              <div className={styles.formActions}>
                <button className={styles.button} type="submit">
                  <span>
                    <i className="fa fa-chevron-circle-right" /> Reset
                  </span>
                </button>
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
    error: getError(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      resetPassword,
    },
    dispatch
  );
}

Reset.propTypes = {
  error: PropTypes.object,
  resetPassword: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reset);
