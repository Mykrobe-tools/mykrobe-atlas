/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './Common.css';
import * as AuthActions from '../../actions/AuthActions';
import type { UserType } from '../../types/UserTypes';

class Forgot extends React.Component {
  handleSubmit(e) {
    e.preventDefault();
    const { forgotPassword } = this.props;

    const userObject: UserType = {
      email: this.refs.email.value,
    };
    forgotPassword(userObject);
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
            <div className={styles.contentTitle}>Forgot password</div>
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
                />
              </div>
              <div className={styles.formActions}>
                <button className={styles.button} type="submit">
                  <span>
                    <i className="fa fa-chevron-circle-right" /> Get new
                    password
                  </span>
                </button>
                <div>
                  <Link className={styles.buttonBorderless} to="/auth/login">
                    Log in
                  </Link>
                </div>
                <div>
                  <Link className={styles.buttonBorderless} to="/auth/signup">
                    Sign up
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
      forgotPassword: AuthActions.forgotPassword,
      deleteFailureReason: AuthActions.deleteFailureReason,
    },
    dispatch
  );
}

Forgot.propTypes = {
  auth: PropTypes.object.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  deleteFailureReason: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Forgot);
