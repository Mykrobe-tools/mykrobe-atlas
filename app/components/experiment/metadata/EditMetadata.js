/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

import styles from './EditMetadata.module.scss';

import { EXPERIMENT_METADATA_FORM_ID } from '../../../modules/experiments';

import Form, { FormFooter } from 'makeandship-js-common/src/components/ui/form';
import {
  SubmitButton,
  CancelButton,
} from 'makeandship-js-common/src/components/ui/buttons';

import experimentUiSchema from './experimentUiSchema';

import { withFileUploadPropTypes } from '../../../hoc/withFileUpload';
import { withExperimentPropTypes } from '../../../hoc/withExperiment';

class EditMetadata extends React.Component<*> {
  onSubmit = (formData: any) => {
    const { updateExperiment, experiment } = this.props;
    // only send metadata, retain the id
    updateExperiment({
      id: experiment.id,
      metadata: formData.metadata,
    });
  };

  onCancelClick = (e) => {
    e && e.preventDefault();
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const {
      isFetching,
      error,
      title,
      experimentOwnerIsCurrentUser,
      schema,
      experimentMetadata,
    } = this.props;
    let uiSchema = experimentUiSchema;
    const readonly = !experimentOwnerIsCurrentUser;
    const formData = { metadata: experimentMetadata };
    return (
      <div className={styles.container}>
        <Container fluid>
          <Form
            title={title}
            formKey={EXPERIMENT_METADATA_FORM_ID}
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={this.onSubmit}
            isFetching={isFetching}
            error={error}
            formData={formData}
          >
            <FormFooter>
              {!readonly && (
                <div>
                  <SubmitButton marginRight>Save metadata</SubmitButton>
                  <CancelButton onClick={this.onCancelClick} />
                </div>
              )}
            </FormFooter>
          </Form>
        </Container>
      </div>
    );
  }
}

EditMetadata.propTypes = {
  ...withFileUploadPropTypes,
  ...withExperimentPropTypes,
  title: PropTypes.string,
  schema: PropTypes.any,
};

export default EditMetadata;
