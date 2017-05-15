/* @flow */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './Common.css';
import * as AuthActions from '../../actions/AuthActions';
import type { UserType } from '../../types/UserTypes';

class SignUp extends React.Component {

  handleSubmit(e) {
    e.preventDefault();
    const { signUp } = this.props;

    const userObject: UserType = {
      email: this.refs.email.value,
      firstname: this.refs.firstname.value,
      lastname: this.refs.lastname.value,
      password: this.refs.password.value
    };
    signUp(userObject);
  }

  componentWillUnmount() {
    const {deleteFailureReason} = this.props;
    deleteFailureReason();
  }

  render() {
    const {failureReason} = this.props.auth;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            Account
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <div className={styles.contentTitle}>
              Sign up
            </div>
            <form onSubmit={(e) => {
              this.handleSubmit(e);
            }}>
              {failureReason && (
                <div className={styles.formErrors}>
                  {failureReason}
                </div>
              )}
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="email">Email</label>
                <input className={styles.input} autoFocus type="email" id="email" ref="email" placeholder="sam.smith@example.com" defaultValue="" />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="firstname">First name</label>
                <input className={styles.input} type="text" id="firstname" ref="firstname" placeholder="Sam" defaultValue="" />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="lastname">Last name</label>
                <input className={styles.input} type="text" id="lastname" ref="lastname" placeholder="Smith" defaultValue="" />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="password">Password</label>
                <input className={styles.input} type="password" id="password" ref="password" />
              </div>
              <div className={styles.formActions}>
                <button className={styles.button} type="submit">
                  <span><i className="fa fa-chevron-circle-right" /> Sign up</span>
                </button>
                <div>
                  <Link className={styles.buttonBorderless} to="/auth/login">Log in</Link>
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
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    signUp: AuthActions.signUp,
    deleteFailureReason: AuthActions.deleteFailureReason
  }, dispatch);
}

SignUp.propTypes = {
  auth: PropTypes.object.isRequired,
  signUp: PropTypes.func.isRequired,
  deleteFailureReason: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
