/* @flow */

/* TODO Refactor to use redux-form */
/* eslint-disable react/no-string-refs */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { goBack, push } from 'react-router-redux';

import styles from './Common.scss';
import type { OrganisationType } from '../../types/OrganisationTypes';
import Loading from '../ui/Loading';

import {
  getOrganisation,
  getOrganisationIsFetching,
  getOrganisationError,
  createOrganisation,
  requestOrganisation,
  updateOrganisation,
  deleteOrganisation,
} from '../../modules/organisations';

class Edit extends React.Component<*> {
  id: string;

  componentWillMount() {
    const { requestOrganisation, organisationId, isNew } = this.props;
    if (!isNew) {
      requestOrganisation(organisationId);
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      createOrganisation,
      updateOrganisation,
      isNew,
      organisationId,
    } = this.props;
    const organisationObject: OrganisationType = {
      id: organisationId,
      name: this.refs.name.value,
      template: this.refs.template.value,
    };
    if (isNew) {
      createOrganisation(organisationObject);
    } else {
      updateOrganisation(organisationObject);
    }
  };

  onCancelClick = () => {
    const { goBack } = this.props;
    goBack();
  };

  deleteOrganisation = () => {
    const { organisation, deleteOrganisation } = this.props;
    if (confirm('Delete organisation?')) {
      deleteOrganisation(organisation);
    }
  };

  render() {
    const { isNew, organisation, isFetching, error } = this.props;
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
    let name, template;
    if (isNew || !organisation) {
      name = '';
      template = 'MODS';
    } else {
      name = organisation.name;
      template = organisation.template;
    }
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Organisations</div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <div className={styles.contentTitle}>
              {isNew ? 'New organisation' : 'Edit organisation'}
            </div>
            <form onSubmit={this.handleSubmit}>
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
                    <i className="fa fa-chevron-circle-right" /> Save
                    organisation
                  </span>
                </button>
                <div>
                  <a onClick={this.onCancelClick}>Cancel</a>
                </div>
                {!isNew && (
                  <div className={styles.destructiveAction}>
                    <a onClick={this.deleteOrganisation}>
                      <i className="fa fa-trash" /> Delete organisation
                    </a>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const getOrganisationId = props => props.match.params.organisationId;
const isNewOrganisationId = organisationId =>
  !organisationId || organisationId === 'new';

function mapStateToProps(state, ownProps) {
  return {
    organisation: getOrganisation(state),
    isFetching: getOrganisationIsFetching(state),
    error: getOrganisationError(state),
    organisationId: getOrganisationId(ownProps),
    isNew: isNewOrganisationId(getOrganisationId(ownProps)),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createOrganisation,
      requestOrganisation,
      updateOrganisation,
      deleteOrganisation,
      push,
      goBack,
    },
    dispatch
  );
}

Edit.propTypes = {
  match: PropTypes.object.isRequired,
  organisation: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.object,
  createOrganisation: PropTypes.func.isRequired,
  requestOrganisation: PropTypes.func.isRequired,
  updateOrganisation: PropTypes.func.isRequired,
  deleteOrganisation: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  isNew: PropTypes.bool.isRequired,
  organisationId: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Edit);
