/* @flow */

/* eslint-disable react/no-string-refs */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

import {
  Select,
  DecoratedForm,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import {
  SubmitButton,
  CancelButton,
  DestructiveButton,
} from 'makeandship-js-common/src/components/ui/buttons';

import type { OrganisationType } from '../../../types/OrganisationTypes';
import OrganisationHeader from '../ui/OrganisationHeader';
import { organisationSchema } from '../../../schemas/organisations';
import { withOrganisationPropTypes } from '../../../hoc/withOrganisation';

import styles from '../../organisations/Common.module.scss';

const uiSchema = {
  template: {
    'ui:widget': Select,
  },
};

class EditOrganisation extends React.Component<*> {
  componentDidMount = () => {
    const { requestOrganisation, organisationId, isNew } = this.props;
    if (!isNew) {
      requestOrganisation && requestOrganisation(organisationId);
    }
  };

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
    if (confirm('Delete organisation? This cannot be undone.')) {
      deleteOrganisation(organisation);
    }
  };

  render() {
    const {
      isNew,
      organisation,
      organisationIsFetching,
      organisationError,
    } = this.props;
    return (
      <div className={styles.container}>
        <OrganisationHeader {...this.props} />
        <div className={styles.container}>
          <Container fluid>
            <DecoratedForm
              formKey="organisations/organisation"
              schema={organisationSchema}
              uiSchema={uiSchema}
              onSubmit={this.onSubmit}
              isFetching={organisationIsFetching}
              error={organisationError}
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
      </div>
    );
  }
}

EditOrganisation.propTypes = {
  ...withOrganisationPropTypes,
  match: PropTypes.object,
  push: PropTypes.func,
  goBack: PropTypes.func,
  isNew: PropTypes.bool,
  organisationId: PropTypes.string,
};

export default EditOrganisation;
