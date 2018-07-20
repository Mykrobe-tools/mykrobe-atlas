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
import Header from '../header/Header';

import {
  requestExperiment,
  getExperiment,
  getIsFetchingExperiment,
  getExperimentError,
  getExperimentMetadataTemplate,
  updateExperiment,
} from '../../modules/experiments';

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

import experimentSchema from 'mykrobe-atlas-api/src/schemas/experiment';

const uiSchema = {};

class EditMetadata extends React.Component<*> {
  componentWillMount() {
    const { requestExperiment, experimentId } = this.props;
    requestExperiment(experimentId);
  }

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

  render() {
    const { experiment, isFetching, error } = this.props;
    return (
      <div className={styles.container}>
        <Header title={'Organisation'} />
        <Container fluid>
          <DecoratedForm
            formKey="experiments/experiment"
            schema={experimentSchema}
            uiSchema={uiSchema}
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
      requestExperiment,
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
  requestExperiment: PropTypes.func.isRequired,
  updateExperiment: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  experimentId: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditMetadata);
