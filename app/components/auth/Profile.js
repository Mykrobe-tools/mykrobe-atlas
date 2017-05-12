/* @flow */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './Common.css';
import * as AuthActions from '../../actions/AuthActions';
import type { AuthType } from '../../types/AuthTypes';
import type { UserType } from '../../types/UserTypes';
import * as OrganisationActions from '../../actions/OrganisationActions.js';
import Loading from '../ui/Loading';

class Profile extends React.Component {

  componentWillMount() {
    const {fetchCurrentUser, requestAllOrganisations} = this.props;
    fetchCurrentUser();
    requestAllOrganisations();
  }

  componentWillUnmount() {
    const {deleteFailureReason} = this.props;
    deleteFailureReason();
  }

  handleSubmit(e) {
    e.preventDefault();
    const { updateCurrentUser } = this.props;
    const userObject: UserType = {
      email: this.refs.email.value,
      firstname: this.refs.firstname.value,
      lastname: this.refs.lastname.value,
      phone: this.refs.phone.value,
      organisation: this.refs.organisation.value
    };
    updateCurrentUser(userObject);
  }

  deleteAccount = (e) => {
    const {deleteCurrentUser} = this.props;
    if (confirm('Delete account?')) {
      deleteCurrentUser();
    }
  }

  render() {
    const {failureReason} = this.props.auth;
    const {signOut, organisations} = this.props;
    const auth: AuthType = this.props.auth;
    const user: ?UserType = auth.user;
    if (!user) {
      return null;
    }
    if (auth.isFetching || organisations.isFetching) {
      return (
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              Profile
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
    const {email, firstname, lastname, phone, organisation} = user;
    const selectedOrganisation = organisation && organisation.id || '';
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Profile
          </h1>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
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
                <input className={styles.input} type="email" id="email" ref="email" placeholder="sam.smith@example.com" defaultValue={email} />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="firstname">First name</label>
                <input className={styles.input} type="text" id="firstname" ref="firstname" placeholder="Sam" defaultValue={firstname} />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="lastname">Last name</label>
                <input className={styles.input} type="text" id="lastname" ref="lastname" placeholder="Smith" defaultValue={lastname} />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="phone">
                  Phone number
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="phone"
                  ref="phone"
                  placeholder="1234567890"
                  defaultValue={phone}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="organisation">Organisation</label>
                <div className={styles.selectWrap}>
                  <select disabled className={styles.select} ref="organisation" id="organisation" defaultValue={selectedOrganisation}>
                    <option />
                    {organisations.data.allOrganisations && organisations.data.allOrganisations.map((org) => {
                      return (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className={styles.formActions}>
                <button className={styles.button} type="submit">
                  <span><i className="fa fa-chevron-circle-right" /> Update profile</span>
                </button>
                <div>
                  <a onClick={(e) => {
                    signOut();
                  }}>Sign out</a>
                </div>
                <div className={styles.destructiveAction}>
                  <a onClick={this.deleteAccount}><i className="fa fa-trash" /> Delete account</a>
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
    organisations: state.organisations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    signOut: AuthActions.signOut,
    fetchCurrentUser: AuthActions.fetchCurrentUser,
    updateCurrentUser: AuthActions.updateCurrentUser,
    deleteFailureReason: AuthActions.deleteFailureReason,
    deleteCurrentUser: AuthActions.deleteCurrentUser,
    requestAllOrganisations: OrganisationActions.requestAllOrganisations
  }, dispatch);
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  organisations: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  fetchCurrentUser: PropTypes.func.isRequired,
  updateCurrentUser: PropTypes.func.isRequired,
  deleteFailureReason: PropTypes.func.isRequired,
  deleteCurrentUser: PropTypes.func.isRequired,
  requestAllOrganisations: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
