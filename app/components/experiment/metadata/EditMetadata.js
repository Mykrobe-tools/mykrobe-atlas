/* @flow */

/* eslint-disable react/no-string-refs */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { goBack, push } from 'react-router-redux';
import { Container } from 'reactstrap';

import Footer from '../../footer/Footer';

import styles from './EditMetadata.scss';

import {
  getExperiment,
  getExperimentOwnerIsCurrentUser,
  getIsFetchingExperiment,
  getExperimentError,
  updateExperiment,
  EXPERIMENT_METADATA_FORM_ID,
} from '../../../modules/experiments';

import {
  DecoratedForm,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import {
  SubmitButton,
  CancelButton,
} from 'makeandship-js-common/src/components/ui/Buttons';

import { filteredSchemaWithSubsections } from '../../../schemas/experiment';
import experimentUiSchema from './experimentUiSchema';

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
    const { goBack } = this.props;
    goBack();
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
      experiment,
      isFetching,
      error,
      title,
      experimentOwnerIsCurrentUser,
      subsections,
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
              formData={{ metadata: experiment.metadata }}
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

function mapStateToProps(state) {
  return {
    experiment: getExperiment(state),
    isFetching: getIsFetchingExperiment(state),
    error: getExperimentError(state),
    experimentOwnerIsCurrentUser: getExperimentOwnerIsCurrentUser(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateExperiment,
      push,
      goBack,
    },
    dispatch
  );
}

EditMetadata.propTypes = {
  experiment: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  experimentOwnerIsCurrentUser: PropTypes.bool,
  error: PropTypes.object,
  updateExperiment: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  title: PropTypes.string,
  subsections: PropTypes.arrayOf(PropTypes.string),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditMetadata);
