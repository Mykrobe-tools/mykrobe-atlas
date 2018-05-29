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
import { push } from 'react-router-redux';

import styles from './Common.css';
import type { OrganisationType } from '../../types/OrganisationTypes';
import Loading from '../ui/Loading';

import {
  getOrganisation,
  getOrganisationIsFetching,
  getOrganisationError,
  requestOrganisation,
  updateOrganisation,
  deleteOrganisation,
} from '../../modules/organisations';

class Edit extends React.Component<*> {
  id: string;

  componentWillMount() {
    const { requestOrganisation } = this.props;
    const { id } = this.props.match.params;
    this.id = id;
    requestOrganisation(this.id);
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
    const { organisation, deleteOrganisation, push } = this.props;
    // const organisationObject: OrganisationType = {
    //   id: this.id,
    // };
    if (confirm('Delete organisation?')) {
      deleteOrganisation(organisation).then(() => {
        push('/organisation');
      });
    }
  };

  render() {
    const { organisation, isFetching, error } = this.props;
    if (isFetching) {
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
              {error && (
                <div className={styles.formErrors}>{error.message}</div>
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
    organisation: getOrganisation(state),
    isFetching: getOrganisationIsFetching(state),
    error: getOrganisationError(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      requestOrganisation,
      updateOrganisation,
      deleteOrganisation,
      push,
    },
    dispatch
  );
}

Edit.propTypes = {
  match: PropTypes.object.isRequired,
  organisation: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.object,
  requestOrganisation: PropTypes.func.isRequired,
  updateOrganisation: PropTypes.func.isRequired,
  deleteOrganisation: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Edit);
