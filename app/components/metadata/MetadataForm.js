/* @flow */

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import moment from 'moment';

import styles from './MetadataForm.css';

import * as MetadataActions from '../../actions/MetadataActions';
import * as NotificationActions from '../../actions/NotificationActions';
import * as NotificationCategories from '../../constants/NotificationCategories';

import Form from '../form/Form';
import FormRow from '../form/FormRow';
import FormLabel from '../form/FormLabel';
import FormInputText from '../form/FormInputText';
import FormInputDate from '../form/FormInputDate';
import FormSelect from '../form/FormSelect';
import FormTextarea from '../form/FormTextarea';
import FormInputRadio from '../form/FormInputRadio';
import FormInputCheckbox from '../form/FormInputCheckbox';
import FormButton from '../form/FormButton';

const locations = require('../../static/locations.json');
const drugs = require('../../static/drugs.json');

class MetadataForm extends Component {
  state: {
    location: string,
    labId: string,
    date: string,
    responsiblePersonId: string,
    responsiblePersonData: string,
    patientId: string,
    sampleId: string,
    sequencingMachine: string,
    patientHistory: string,
    sampleType: string,
    susceptibility: Object,
    hivPositive: string,
    treatedForTB: string,
    shareSequence: boolean
  };

  constructor(props: Object) {
    super(props);
    this.state = props.metadata;

    // const app = require('electron').remote.app;
    // const locale = app.getLocale();
    // console.log('locale', locale); // returns en-US
  }

  componentWillUnmount() {
    this.props.setMetadata(this.state);
  }

  handleSubmit(event: Event) {
    event.preventDefault();

    // TODO: Error checking

    this.props.postMetadataForm(this.state);
    this.props.showNotification({
      category: NotificationCategories.MESSAGE,
      content: 'The form has been submitted'
    });
    this.setState(this.props.metadata);
  }

  handleDateChange(date: moment) {
    this.setState({
      date: date.format()
    });
  }

  handleCheckboxChange(event: InputEvent) {
    var state = {
      [event.target.name]: event.target.checked
    };
    this.setState(state);
  }

  handleChange(event: InputEvent) {
    var state = {
      [event.target.name]: event.target.value
    };
    this.setState(state);
  }

  handleSusceptibilityChange(event: InputEvent) {
    var state = {};
    state.susceptibility = Object.assign({}, this.state.susceptibility, {
      [event.target.name]: event.target.value
    });
    this.setState(state);
  }

  render() {
    const { location, labId, date, responsiblePersonId, responsiblePersonData, patientId, sampleId, sequencingMachine, patientHistory, sampleType, susceptibility, hivPositive, treatedForTB, shareSequence } = this.state;
    return (
      <Form onSubmit={(event) => this.handleSubmit(event)}>
        <FormRow>
          <FormSelect
            title="Collection Location"
            name="location"
            selectedOption={location}
            options={locations.map((location, index) => {
              return ({
                value: location['alpha-2'],
                label: location.name
              });
            })}
            onChange={(event) => this.handleChange(event)}
          />
        </FormRow>
        <FormRow>
          <FormInputText
            title="Lab ID"
            name="labId"
            type="text"
            value={labId}
            onChange={(event) => this.handleChange(event)}
          />
        </FormRow>
        <FormRow>
          <FormInputDate
            title="Collection date"
            name="date"
            value={date}
            onChange={(date) => this.handleDateChange(date)}
          />
        </FormRow>
        <FormRow>
          <FormInputText
            title="Responsible Person ID"
            name="responsiblePersonId"
            type="text"
            value={responsiblePersonId}
            onChange={(event) => this.handleChange(event)}
          />
        </FormRow>
        <FormRow>
          <FormTextarea
            title="Responsible Person Data"
            rows="3"
            name="responsiblePersonData"
            value={responsiblePersonData}
            onChange={(event) => this.handleChange(event)}
          />
        </FormRow>
        <FormRow>
          <FormInputText
            title="Patient ID"
            name="patientId"
            type="text"
            value={patientId}
            onChange={(event) => this.handleChange(event)}
          />
        </FormRow>
        <FormRow>
          <FormInputText
            title="Sample ID"
            name="sampleId"
            type="text"
            value={sampleId}
            onChange={(event) => this.handleChange(event)}
          />
        </FormRow>
        <FormRow>
          <FormInputText
            title="Sequencing Machine"
            name="sequencingMachine"
            type="text"
            value={sequencingMachine}
            onChange={(event) => this.handleChange(event)}
          />
        </FormRow>
        <FormRow>
          <FormInputRadio
            title="Patient History"
            name="patientHistory"
            options={[
              {value: 'yes', label: 'Yes'},
              {value: 'no', label: 'No'},
              {value: 'unknown', label: 'Not Known'}
            ]}
            selectedOption={patientHistory}
            onChange={(event) => this.handleChange(event)}
          />
        </FormRow>
        <FormRow>
          <FormInputText
            title="Sample Type"
            name="sampleType"
            type="text"
            value={sampleType}
            onChange={(event) => this.handleChange(event)}
          />
        </FormRow>
        <FormRow>
          <div className={styles.susceptibilityWrap}>
            <div className={styles.susceptibilityLabel}>
              <FormLabel label="Phenotypic susceptibility" />
            </div>
            <div className={styles.susceptibilityRows}>
              {drugs.map((drug, index) => {
                return (
                  <div key={index} className={styles.susceptibilityRow}>
                    <FormInputRadio
                      title={drug}
                      name={drug}
                      options={[
                        {value: 'S', label: 'Susceptible'},
                        {value: 'R', label: 'Resistant'},
                        {value: 'I', label: 'Inconclusive'},
                        {value: 'U', label: 'Untested'}
                      ]}
                      selectedOption={susceptibility[drug]}
                      onChange={(event) => this.handleSusceptibilityChange(event)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </FormRow>
        <FormRow>
          <FormInputRadio
            title="Patient is HIV positive"
            name="hivPositive"
            options={[
              {value: 'yes', label: 'Yes'},
              {value: 'no', label: 'No'},
              {value: 'unknown', label: 'Not Known'}
            ]}
            selectedOption={hivPositive}
            onChange={(event) => this.handleChange(event)}
          />
        </FormRow>
        <FormRow>
          <FormInputRadio
            title="Patient has been treated for TB before"
            name="treatedForTB"
            options={[
              {value: 'yes', label: 'Yes'},
              {value: 'no', label: 'No'},
              {value: 'unknown', label: 'Not Known'}
            ]}
            selectedOption={treatedForTB}
            onChange={(event) => this.handleChange(event)}
          />
        </FormRow>
        <FormRow>
          <FormInputCheckbox
            title="Share bacterial DNA sequence with Atlas"
            name="shareSequence"
            options={[
              {value: true, label: 'Yes'}
            ]}
            selectedOptions={[shareSequence]}
            onChange={(event) => this.handleCheckboxChange(event)}
          />
        </FormRow>
        <FormRow>
          <FormButton
            type="submit"
            label="Save"
          />
        </FormRow>
      </Form>
    );
  }
}

function mapStateToProps(state) {
  return {
    metadata: state.metadata
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    postMetadataForm: MetadataActions.postMetadataForm,
    setMetadata: MetadataActions.setMetadata,
    showNotification: NotificationActions.showNotification
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MetadataForm);
