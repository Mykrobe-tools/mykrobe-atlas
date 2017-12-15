/* @flow */

/* TODO Refactor to use redux-form */
/* eslint-disable react/no-string-refs */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './Common.css';
import * as AuthActions from '../../actions/AuthActions';
import type { AuthResetPasswordType } from '../../types/AuthTypes';

class Reset extends React.Component {
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

  componentWillUnmount() {
    const { deleteFailureReason } = this.props;
    deleteFailureReason();
  }

  render() {
    const { failureReason } = this.props.auth;
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
              {failureReason && (
                <div className={styles.formErrors}>{failureReason}</div>
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
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      resetPassword: AuthActions.resetPassword,
      deleteFailureReason: AuthActions.deleteFailureReason,
    },
    dispatch
  );
}

Reset.propTypes = {
  auth: PropTypes.object.isRequired,
  resetPassword: PropTypes.func.isRequired,
  deleteFailureReason: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Reset);
