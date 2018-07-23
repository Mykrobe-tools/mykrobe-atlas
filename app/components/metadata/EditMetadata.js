/* @flow */

/* TODO Refactor to use redux-form */
/* eslint-disable react/no-string-refs */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { goBack, push } from 'react-router-redux';
import { Container } from 'reactstrap';

import styles from './EditMetadata.scss';

import {
  getExperiment,
  getIsFetchingExperiment,
  getExperimentError,
  updateExperiment,
} from '../../modules/experiments';

import {
  DecoratedForm,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import {
  SubmitButton,
  CancelButton,
} from 'makeandship-js-common/src/components/ui/Buttons';

import experimentSchema from 'mykrobe-atlas-api/src/schemas/experiment';
import experimentUiSchema from './experimentUiSchema';

class EditMetadata extends React.Component<*> {
  onSubmit = (formData: any) => {
    const { updateExperiment, experiment } = this.props;
    updateExperiment({
      ...experiment,
      metadata: formData,
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
    const { experiment, isFetching, error, title } = this.props;
    const schema = this.deriveSchema();
    return (
      <div className={styles.container}>
        <Container fluid>
          <DecoratedForm
            title={title}
            formKey={this.formKey()}
            schema={schema}
            uiSchema={experimentUiSchema}
            onSubmit={this.onSubmit}
            isFetching={isFetching}
            error={error}
            formData={experiment}
          >
            <FormFooter>
              <div>
                <SubmitButton marginRight>Save metadata</SubmitButton>
                <CancelButton onClick={this.onCancelClick} />
              </div>
            </FormFooter>
          </DecoratedForm>
        </Container>
      </div>
    );
  }
}

const getExperimentId = props => props.match.params.experimentId;

function mapStateToProps(state, ownProps) {
  return {
    experimentId: getExperimentId(ownProps),
    experiment: getExperiment(state),
    isFetching: getIsFetchingExperiment(state),
    error: getExperimentError(state),
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
  error: PropTypes.object,
  updateExperiment: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  experimentId: PropTypes.string,
  title: PropTypes.string,
  subsections: PropTypes.arrayOf(PropTypes.string),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditMetadata);
