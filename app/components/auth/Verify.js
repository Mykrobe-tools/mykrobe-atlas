/* @flow */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

import * as AuthActions from '../../actions/AuthActions';
import type { AuthType, AuthVerificationType } from '../../types/AuthTypes';
import Loading from '../ui/Loading';

import styles from './Common.css';

class Verify extends React.Component {

  componentWillMount() {
    const {verify} = this.props;
    const {verificationToken} = this.props.params;
    const userObject: AuthVerificationType = {
      verificationToken
    };
    verify(userObject);
  }

  componentWillUnmount() {
    const {deleteFailureReason} = this.props;
    deleteFailureReason();
  }

  render() {
    const {failureReason} = this.props.auth;
    const auth: AuthType = this.props.auth;
    if (auth.isFetching) {
      return (
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              Verify
            </h1>
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.formContainer}>
              <Loading />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Verify
          </h1>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            {failureReason ? (
              <div className={styles.formErrors}>
                {failureReason}
              </div>
            ) : (
              <div>
                You have been verified, you may now <Link to="/auth/login">log in</Link>
                <div className={styles.formActions}>
                  <Link to="/auth/login">Log in</Link>
                </div>
              </div>
            )}
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
    verify: AuthActions.verify,
    deleteFailureReason: AuthActions.deleteFailureReason
  }, dispatch);
}

Verify.propTypes = {
  auth: PropTypes.object.isRequired,
  verify: PropTypes.func.isRequired,
  deleteFailureReason: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
