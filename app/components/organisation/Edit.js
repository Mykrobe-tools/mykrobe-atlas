/* @flow */

/* TODO Refactor to use redux-form */
/* eslint-disable react/no-string-refs */

// TODO: split and separate all organisations vs single
// organisations
// organisation

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import styles from './Common.css';
import type { OrganisationType } from '../../types/OrganisationTypes';
import Loading from '../ui/Loading';

import {
  getOrganisations,
  getFailureReason,
  requestOrganisation,
  updateOrganisation,
  deleteOrganisation,
  deleteFailureReason,
} from '../../modules/organisations';

class Edit extends React.Component {
  id: string;

  componentWillMount() {
    const { requestOrganisation } = this.props;
    const { id } = this.props.match.params;
    this.id = id;
    requestOrganisation(this.id);
  }

  componentWillUnmount() {
    const { deleteFailureReason } = this.props;
    deleteFailureReason();
  }

  handleSubmit(e) {
    e.preventDefault();
    const { updateOrganisation } = this.props;
    const organisationObject: OrganisationType = {
      id: this.id,
      name: this.refs.name.value,
      template: this.refs.template.value,
    };
    updateOrganisation(organisationObject);
  }

  deleteOrganisation = () => {
    const { deleteOrganisation } = this.props;
    const organisationObject: OrganisationType = {
      id: this.id,
    };
    if (confirm('Delete organisation?')) {
      deleteOrganisation(organisationObject);
    }
  };

  render() {
    const { organisations, failureReason } = this.props;
    const organisation: ?OrganisationType = organisations.data.organisation;
    if (organisations.isFetching) {
      return (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.title}>Organisation</div>
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.formContainer}>
              <Loading />
            </div>
          </div>
        </div>
      );
    }
    console.log(organisation);
    if (!organisation) {
      return null;
    }
    const { name, template } = organisation;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Organisations</div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <div className={styles.contentTitle}>Edit organisation</div>
            <form
              onSubmit={e => {
                this.handleSubmit(e);
              }}
            >
              {failureReason && (
                <div className={styles.formErrors}>{failureReason}</div>
              )}
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="name">
                  Name
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="name"
                  ref="name"
                  placeholder="Org name"
                  defaultValue={name}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="organisation">
                  Template
                </label>
                <div className={styles.selectWrap}>
                  <select
                    className={styles.select}
                    ref="template"
                    id="template"
                    defaultValue={template}
                  >
                    <option />
                    <option>MGIT</option>
                    <option>LJ</option>
                    <option>Microtitre plate</option>
                    <option>MODS</option>
                  </select>
                </div>
              </div>
              <div className={styles.formActions}>
                <button className={styles.button} type="submit">
                  <span>
                    <i className="fa fa-chevron-circle-right" /> Update
                    organisation
                  </span>
                </button>
                <div>
                  <Link to="/organisation/list">View all organisations</Link>
                </div>
                <div className={styles.destructiveAction}>
                  <a onClick={this.deleteOrganisation}>
                    <i className="fa fa-trash" /> Delete organisation
                  </a>
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
    organisations: getOrganisations(state),
    failureReason: getFailureReason(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      requestOrganisation,
      updateOrganisation,
      deleteFailureReason,
      deleteOrganisation,
    },
    dispatch
  );
}

Edit.propTypes = {
  match: PropTypes.object.isRequired,
  organisations: PropTypes.object.isRequired,
  failureReason: PropTypes.string,
  requestOrganisation: PropTypes.func.isRequired,
  updateOrganisation: PropTypes.func.isRequired,
  deleteFailureReason: PropTypes.func.isRequired,
  deleteOrganisation: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
