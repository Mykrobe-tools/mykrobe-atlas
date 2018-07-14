/* @flow */

/* TODO Refactor to use redux-form */
/* eslint-disable react/no-string-refs */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { goBack, push } from 'react-router-redux';
import { Container } from 'reactstrap';

import styles from './Common.scss';
import type { OrganisationType } from '../../types/OrganisationTypes';
import Header from '../header/Header';

import {
  getOrganisation,
  getOrganisationIsFetching,
  getOrganisationError,
  createOrganisation,
  requestOrganisation,
  updateOrganisation,
  deleteOrganisation,
} from '../../modules/organisations';

import {
  Select,
  DecoratedForm,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import {
  SubmitButton,
  CancelButton,
  DestructiveButton,
} from 'makeandship-js-common/src/components/ui/Buttons';

import { organisationSchema } from '../../schemas/organisations';

const uiSchema = {
  template: {
    'ui:widget': Select,
  },
};

class Edit extends React.Component<*> {
  id: string;

  componentWillMount() {
    const { requestOrganisation, organisationId, isNew } = this.props;
    if (!isNew) {
      requestOrganisation(organisationId);
    }
  }

  onSubmit = formData => {
    const { createOrganisation, updateOrganisation, isNew } = this.props;
    if (isNew) {
      createOrganisation(formData);
    } else {
      updateOrganisation(formData);
    }
  };

  onCancelClick = e => {
    e && e.preventDefault();
    const { goBack } = this.props;
    goBack();
  };

  onDeleteClick = e => {
    e && e.preventDefault();
    const { organisation, deleteOrganisation } = this.props;
    if (confirm('Delete organisation?')) {
      deleteOrganisation(organisation);
    }
  };

  render() {
    const { isNew, organisation, isFetching, error } = this.props;
    return (
      <div className={styles.container}>
        <Header title={'Organisation'} />
        <Container fluid>
          <DecoratedForm
            formKey="organisations/organisation"
            schema={organisationSchema}
            uiSchema={uiSchema}
            onSubmit={this.onSubmit}
            isFetching={isFetching}
            error={error}
            formData={organisation}
          >
            <FormFooter>
              <div>
                <SubmitButton marginRight>
                  {isNew ? 'Create organisation' : 'Save organisation'}
                </SubmitButton>
                <CancelButton onClick={this.onCancelClick} />
              </div>
              {!isNew && (
                <DestructiveButton onClick={this.onDeleteClick}>
                  Delete organisation
                </DestructiveButton>
              )}
            </FormFooter>
          </DecoratedForm>
        </Container>
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
