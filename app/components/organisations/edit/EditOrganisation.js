/* @flow */

/* eslint-disable react/no-string-refs */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

import type { OrganisationType } from '../../../types/OrganisationTypes';
import HeaderContainer from '../../ui/header/HeaderContainer';
import Footer from '../../ui/footer/Footer';

import styles from '../Common.scss';

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

import { organisationSchema } from '../../../schemas/organisations';

const uiSchema = {
  template: {
    'ui:widget': Select,
  },
};

class EditOrganisation extends React.Component<*> {
  componentWillMount() {
    const { requestOrganisation, organisationId, isNew } = this.props;
    if (!isNew) {
      requestOrganisation(organisationId);
    }
  }

  onSubmit = (formData: OrganisationType) => {
    const { createOrganisation, updateOrganisation, isNew } = this.props;
    if (isNew) {
      createOrganisation(formData);
    } else {
      updateOrganisation(formData);
    }
  };

  onCancelClick = (e: any) => {
    e && e.preventDefault();
    const { goBack } = this.props;
    goBack();
  };

  onDeleteClick = (e: any) => {
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
        <HeaderContainer title={'Organisation'} />
        <div className={styles.container}>
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
        <Footer />
      </div>
    );
  }
}

EditOrganisation.propTypes = {
  match: PropTypes.object,
  organisation: PropTypes.object,
  isFetching: PropTypes.bool,
  error: PropTypes.object,
  createOrganisation: PropTypes.func,
  requestOrganisation: PropTypes.func,
  updateOrganisation: PropTypes.func,
  deleteOrganisation: PropTypes.func,
  push: PropTypes.func,
  goBack: PropTypes.func,
  isNew: PropTypes.bool,
  organisationId: PropTypes.string,
};

export default EditOrganisation;
