/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

import Footer from '../../ui/footer/Footer';

import styles from './EditMetadata.scss';

import { EXPERIMENT_METADATA_FORM_ID } from '../../../modules/experiments';

import {
  DecoratedForm,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import {
  SubmitButton,
  CancelButton,
} from 'makeandship-js-common/src/components/ui/Buttons';

import AppDocumentTitle from '../../ui/AppDocumentTitle';

import { filteredSchemaWithSubsections } from '../../../schemas/experiment';
import experimentUiSchema from './experimentUiSchema';

import { withFileUploadPropTypes } from '../../../hoc/withFileUpload';
import { withExperimentPropTypes } from '../../../hoc/withExperiment';

// TODO: remove once tested

const USE_UNIQUE_FORM_ID = false;

class EditMetadata extends React.Component<*> {
  onSubmit = (formData: any) => {
    const { updateExperiment, experiment } = this.props;
    // only send metadata, retain the id
    updateExperiment({
      id: experiment.id,
      metadata: formData.metadata,
    });
  };

  onCancelClick = e => {
    e && e.preventDefault();
    const { history } = this.props;
    history.goBack();
  };

  formKey = () => {
    const { subsections } = this.props;
    if (!USE_UNIQUE_FORM_ID || !subsections) {
      return EXPERIMENT_METADATA_FORM_ID;
    }
    const additional = subsections.join('-');
    return `${EXPERIMENT_METADATA_FORM_ID}/${additional}`;
  };

  render() {
    const {
      isFetching,
      error,
      title,
      experimentOwnerIsCurrentUser,
      subsections,
      experimentIsolateId,
      experimentMetadata,
    } = this.props;
    const schema = filteredSchemaWithSubsections(subsections);
    let uiSchema = experimentUiSchema;
    const readonly = !experimentOwnerIsCurrentUser;
    if (readonly) {
      uiSchema = {
        'ui:readonly': true,
        ...experimentUiSchema,
      };
    }
    return (
      <div className={styles.container}>
        <AppDocumentTitle title={[experimentIsolateId, 'Metadata', title]} />
        <div className={styles.container}>
          <Container fluid>
            <DecoratedForm
              title={title}
              formKey={this.formKey()}
              schema={schema}
              uiSchema={uiSchema}
              onSubmit={this.onSubmit}
              isFetching={isFetching}
              error={error}
              formData={{ metadata: experimentMetadata }}
            >
              <FormFooter>
                {!readonly && (
                  <div>
                    <SubmitButton marginRight>Save metadata</SubmitButton>
                    <CancelButton onClick={this.onCancelClick} />
                  </div>
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

EditMetadata.propTypes = {
  ...withFileUploadPropTypes,
  ...withExperimentPropTypes,
  title: PropTypes.string,
  subsections: PropTypes.arrayOf(PropTypes.string),
};

export default EditMetadata;
