/* @flow */

/* TODO Refactor to use redux-form */
/* eslint-disable react/no-string-refs */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';

import styles from './Common.css';
import type { OrganisationType } from '../../types/OrganisationTypes';

import {
  createOrganisation,
  getOrganisationError,
} from '../../modules/organisations';

class Add extends React.Component {
  handleSubmit(e) {
    e.preventDefault();
    const { createOrganisation, push } = this.props;

    const organisationObject: OrganisationType = {
      name: this.refs.name.value,
    };
    createOrganisation(organisationObject).then(organisation => {
      push(`/organisation/edit/${organisation.id}`);
    });
  }

  render() {
    const { error } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Organisations</div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <div className={styles.contentTitle}>Add organisation</div>
            <form
              onSubmit={e => {
                this.handleSubmit(e);
              }}
            >
              {error && (
                <div className={styles.formErrors}>{error.message}</div>
              )}
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="name">
                  Name
                </label>
                <input
                  className={styles.input}
                  autoFocus
                  required
                  type="text"
                  id="name"
                  ref="name"
                  placeholder="Org name"
                  defaultValue=""
                />
              </div>
              <div className={styles.formActions}>
                <button className={styles.button} type="submit">
                  <span>
                    <i className="fa fa-chevron-circle-right" /> Add
                  </span>
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
    error: getOrganisationError(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createOrganisation,
      push,
    },
    dispatch
  );
}

Add.propTypes = {
  error: PropTypes.object,
  createOrganisation: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Add);
