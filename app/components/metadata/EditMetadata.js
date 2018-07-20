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
  DatePicker,
  DateTimePicker,
  DecoratedForm,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import {
  SubmitButton,
  CancelButton,
  DestructiveButton,
} from 'makeandship-js-common/src/components/ui/Buttons';

import experimentSchema from 'mykrobe-atlas-api/src/schemas/experiment';

const InlineRadio = {
  'ui:widget': 'radio',
  'ui:options': {
    inline: true,
  },
  'ui:layout': {
    md: 9,
  },
};

const uiSchema = {
  metadata: {
    patient: {
      genderAtBirth: InlineRadio,
      age: {
        'ui:layout': {
          md: 3,
        },
      },
      bmi: {
        'ui:layout': {
          md: 3,
        },
      },
      countryOfBirth: {
        'ui:widget': Select,
      },
      injectingDrugUse: InlineRadio,
      homeless: InlineRadio,
      imprisoned: InlineRadio,
      smoker: InlineRadio,
      diabetic: {
        'ui:widget': Select,
      },
      hivStatus: {
        'ui:widget': Select,
      },
    },
    sample: {
      collectionDate: {
        'ui:widget': DatePicker,
        'ui:layout': {
          md: 3,
        },
      },
      prospectiveIsolate: InlineRadio,
      countryIsolate: {
        'ui:widget': Select,
      },
      dateArrived: {
        'ui:widget': DatePicker,
        'ui:layout': {
          md: 3,
        },
      },
      anatomicalOrigin: {
        'ui:widget': Select,
      },
      smear: {
        'ui:widget': Select,
      },
    },
    genotyping: {
      wgsPlatform: InlineRadio,
      otherGenotypeInformation: InlineRadio,
      genexpert: InlineRadio,
      hain: InlineRadio,
      hainRif: InlineRadio,
      hainInh: InlineRadio,
      hainFl: InlineRadio,
      hainAm: InlineRadio,
      hainEth: InlineRadio,
    },
    phenotyping: {
      phenotypeInformationFirstLineDrugs: InlineRadio,
      phenotypeInformationOtherDrugs: InlineRadio,
    },
  },
};

Object.entries(experimentSchema.definitions.Phenotyping.properties).forEach(
  ([key, value]) => {
    if (value['$ref'] === '#/definitions/Susceptibility') {
      uiSchema.metadata.phenotyping[key] = {
        susceptibility: InlineRadio,
        method: InlineRadio,
      };
    }
  }
);

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
