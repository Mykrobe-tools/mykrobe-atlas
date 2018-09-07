/* @flow */

/* TODO Refactor to use redux-form */
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
} from '../../../modules/experiments';

import {
  DecoratedForm,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import {
  SubmitButton,
  CancelButton,
} from 'makeandship-js-common/src/components/ui/Buttons';

import { experimentSchema } from '../../../schemas/experiment';
import experimentUiSchema from './experimentUiSchema';

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

  // onDeleteClick = e => {
  //   e && e.preventDefault();
  //   const { organisation, deleteOrganisation } = this.props;
  //   if (confirm('Delete organisation?')) {
  //     deleteOrganisation(organisation);
  //   }
  // };

  deriveSchema = () => {
    const { subsections } = this.props;
    if (!subsections) {
      return experimentSchema;
    }
    const properties = {};
    Object.entries(experimentSchema.definitions.Metadata.properties).forEach(
      ([key, value]) => {
        if (subsections.includes(key)) {
          properties[key] = value;
        }
      }
    );

    const derivedSchema = {
      ...experimentSchema,
      definitions: {
        ...experimentSchema.definitions,
        Metadata: {
          // filtering what's shown in metadata
          ...experimentSchema.definitions.Metadata,
          title: '',
          properties,
        },
      },
      properties: {
        // only include metadata
        metadata: experimentSchema.properties.metadata,
      },
    };
    return derivedSchema;
  };

  formKey = () => {
    const { subsections } = this.props;
    if (!subsections) {
      return 'experiments/experiment/metadata';
    }
    const additional = subsections.join('-');
    return `experiments/experiment/metadata/${additional}`;
  };

  render() {
    const {
      experiment,
      isFetching,
      error,
      title,
      experimentOwnerIsCurrentUser,
    } = this.props;
    const schema = this.deriveSchema();
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
