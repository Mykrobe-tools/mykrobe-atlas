/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './Common.css';
import * as AuthActions from '../../actions/AuthActions';
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
    const { failureReason } = this.props.auth;
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
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      signIn: AuthActions.signIn,
      deleteFailureReason: AuthActions.deleteFailureReason,
    },
    dispatch
  );
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  signIn: PropTypes.func.isRequired,
  deleteFailureReason: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
