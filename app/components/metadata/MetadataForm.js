/* @flow */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import styles from './MetadataForm.css';

import * as MetadataActions from 'actions/MetadataActions';

import Form from 'components/form/Form';
import FormLabel from 'components/form/FormLabel';
import FormInputText from 'components/form/FormInputText';
import FormInputDate from 'components/form/FormInputDate';
import FormSelect from 'components/form/FormSelect';
import FormTextarea from 'components/form/FormTextarea';
import FormInputRadio from 'components/form/FormInputRadio';
import FormInputCheckbox from 'components/form/FormInputCheckbox';
import FormButton from 'components/form/FormButton';

const locations = require('static/locations.json');
const drugs = require('static/drugs.json');

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
    this.props.postMetadataForm(this.state);
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
    return (
      <Form onSubmit={(event) => this.handleSubmit(event)}>
        <FormSelect
          title="Collection Location"
          name="location"
          selectedOption={this.state.location}
          options={locations.map((location, index) => {
            return({
              value: location['alpha-2'],
              label: location.name
            });
          })}
          onChange={(event) => this.handleChange(event)}
        />
        <FormInputText
          title="Lab ID"
          name="labId"
          type="text"
          value={this.state.labId}
          onChange={(event) => this.handleChange(event)}
        />
        <FormInputDate
          title="Collection date"
          name="date"
          value={this.state.date}
          onChange={(date) => this.handleDateChange(date)}
        />
        <FormInputText
          title="Responsible Person ID"
          name="responsiblePersonId"
          type="text"
          value={this.state.responsiblePersonId}
          onChange={(event) => this.handleChange(event)}
        />
        <FormTextarea
          title="Responsible Person Data"
          rows="3"
          name="responsiblePersonData"
          value={this.state.responsiblePersonData}
          onChange={(event) => this.handleChange(event)}
        />
        <FormInputText
          title="Patient ID"
          name="patientId"
          type="text"
          value={this.state.patientId}
          onChange={(event) => this.handleChange(event)}
        />
        <FormInputText
          title="Sample ID"
          name="sampleId"
          type="text"
          value={this.state.sampleId}
          onChange={(event) => this.handleChange(event)}
        />
        <FormInputText
          title="Sequencing Machine"
          name="sequencingMachine"
          type="text"
          value={this.state.sequencingMachine}
          onChange={(event) => this.handleChange(event)}
        />
        <FormInputRadio
          title="Patient History"
          name="patientHistory"
          options={[
            {value: 'yes', label: 'Yes'},
            {value: 'no', label: 'No'},
            {value: 'unknown', label: 'Not Known'}
          ]}
          selectedOption={this.state.patientHistory}
          onChange={(event) => this.handleChange(event)}
        />
        <FormInputText
          title="Sample Type"
          name="sampleType"
          type="text"
          value={this.state.sampleType}
          onChange={(event) => this.handleChange(event)}
        />

        <FormLabel label="Phenotypic susceptibility" />
        {drugs.map((drug, index) => {
          return (
            <div key={index}>
              <FormInputRadio
                title={drug}
                name={drug}
                options={[
                  {value: 'S', label: 'Susceptible'},
                  {value: 'R', label: 'Resistant'},
                  {value: 'I', label: 'Inconclusive'},
                  {value: 'U', label: 'Untested'}
                ]}
                selectedOption={this.state.susceptibility[drug]}
                onChange={(event) => this.handleSusceptibilityChange(event)}
              />
            </div>
          )
        })}

        <FormInputRadio
          title="Patient is HIV positive"
          name="hivPositive"
          options={[
            {value: 'yes', label: 'Yes'},
            {value: 'no', label: 'No'},
            {value: 'unknown', label: 'Not Known'}
          ]}
          selectedOption={this.state.hivPositive}
          onChange={(event) => this.handleChange(event)}
        />
        <FormInputRadio
          title="Patient has been treated for TB before"
          name="treatedForTB"
          options={[
            {value: 'yes', label: 'Yes'},
            {value: 'no', label: 'No'},
            {value: 'unknown', label: 'Not Known'}
          ]}
          selectedOption={this.state.treatedForTB}
          onChange={(event) => this.handleChange(event)}
        />
        <FormInputCheckbox
          title="Share bacterial DNA sequence with Atlas"
          name="shareSequence"
          options={[
            {value: true, label: 'Yes'}
          ]}
          selectedOptions={[this.state.shareSequence]}
          onChange={(event) => this.handleCheckboxChange(event)}
        />
        <FormButton
          type="submit"
          label="Save"
        />
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
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MetadataForm);
