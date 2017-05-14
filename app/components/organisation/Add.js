/* @flow */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './Common.css';
import * as OrganisationActions from '../../actions/OrganisationActions';
import type { OrganisationType } from '../../types/OrganisationTypes';

class Add extends React.Component {

  handleSubmit(e) {
    e.preventDefault();
    const { createOrganisation } = this.props;

    const organisationObject: OrganisationType = {
      name: this.refs.name.value
    };
    createOrganisation(organisationObject);
  }

  componentWillUnmount() {
    const {deleteFailureReason} = this.props;
    deleteFailureReason();
  }

  render() {
    const {failureReason} = this.props.organisations;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            Add organisation
          </div>
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
                <label className={styles.label} htmlFor="name">Name</label>
                <input className={styles.input} autoFocus required type="text" id="name" ref="name" placeholder="Org name" defaultValue="" />
              </div>
              <div className={styles.formActions}>
                <button className={styles.button} type="submit">
                  <span><i className="fa fa-chevron-circle-right" /> Add</span>
                </button>
                <div>
                  <Link to="/organisation/list">View all organisations</Link>
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
    organisations: state.organisations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createOrganisation: OrganisationActions.createOrganisation,
    deleteFailureReason: OrganisationActions.deleteFailureReason
  }, dispatch);
}

Add.propTypes = {
  organisations: PropTypes.object.isRequired,
  createOrganisation: PropTypes.func.isRequired,
  deleteFailureReason: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Add);
