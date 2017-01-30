/* @flow */

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import moment from 'moment';

import styles from './MetadataForm.css';

import * as MetadataActions from '../../actions/MetadataActions';

import Form from '../form/Form';
import Fieldset from '../form/Fieldset';
import FormRow from '../form/FormRow';
import FormLabel from '../form/FormLabel';
import FormInputText from '../form/FormInputText';
import FormInputDate from '../form/FormInputDate';
import FormTextarea from '../form/FormTextarea';
import FormInputRadio from '../form/FormInputRadio';
import FormInputCheckbox from '../form/FormInputCheckbox';
import FormSelect from '../form/FormSelect';
import FormTypeahead from '../form/FormTypeahead';
import FormButton from '../form/FormButton';

const locations = require('../../static/locations.json');
const drugs = require('../../static/drugs.json');

class MetadataForm extends Component {
  state: {
    patientId: string,
    siteId: string,
    genderAtBirth: string,
    countryOfBirth: string,
    bmi: number,
    injectingDrugUse: string,
    homeless: string,
    imprisoned: string,
    smoker: string,
    diabetic: string,
    hivStatus: string,
    art: string,
    labId: string,
    isolateId: string,
    collectionDate: string,
    prospectiveIsolate: boolean,

    location: string,
    labId: string,
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
  }

  handleDateChange(field: string, date: moment) {
    this.setState({
      [field]: date.format()
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

  handleTypeaheadChange(name: string, value: string) {
    var state = {
      [name]: value
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
    const { patientId, siteId, genderAtBirth, countryOfBirth, bmi, injectingDrugUse, homeless, imprisoned, smoker, diabetic, hivStatus, art, labId, isolateId, collectionDate, prospectiveIsolate,
      responsiblePersonId, responsiblePersonData, sampleId, sequencingMachine, patientHistory, sampleType, susceptibility, hivPositive, treatedForTB, shareSequence } = this.state;
    return (
      <Form onSubmit={(event) => this.handleSubmit(event)}>
        <Fieldset legend="Patient">
          <FormRow>
            <FormInputText
              title="Patient ID"
              name="patientId"
              type="text"
              required
              value={patientId}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormInputText
              title="Site ID"
              name="siteId"
              type="text"
              required
              value={siteId}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormSelect
              title="Gender at birth"
              name="genderAtBirth"
              value={genderAtBirth}
              options={[
                {
                  value: 'male',
                  label: 'Male'
                },
                {
                  value: 'female',
                  label: 'Female'
                },
                {
                  value: 'other',
                  label: 'Other or Intersex'
                },
                {
                  value: 'unknown',
                  label: 'Not known / unavailable'
                }
              ]}
              onChange={(e) => this.handleChange(e)}
            />
          </FormRow>
          <FormRow>
            <FormTypeahead
              title="Country of birth"
              name="countryOfBirth"
              value={countryOfBirth}
              suggestions={locations.map((location, index) => {
                return ({
                  value: location['alpha-2'],
                  label: location.name
                });
              })}
              onChange={(name, value) => this.handleTypeaheadChange(name, value)}
            />
          </FormRow>
        </Fieldset>

        <Fieldset legend="Patient characteristics at isolation">
          <FormRow>
            <FormInputText
              title="BMI (kg/m2)"
              name="bmi"
              type="text"
              value={bmi}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormInputRadio
              title="Injecting drug use"
              name="injectingDrugUse"
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'},
                {value: 'unknown', label: 'Not Known'}
              ]}
              selectedOption={injectingDrugUse}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormInputRadio
              title="Homeless"
              name="homeless"
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'},
                {value: 'unknown', label: 'Not Known'}
              ]}
              selectedOption={homeless}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormInputRadio
              title="Imprisoned"
              name="imprisoned"
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'},
                {value: 'unknown', label: 'Not Known'}
              ]}
              selectedOption={imprisoned}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormInputRadio
              title="Smoker"
              name="smoker"
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'},
                {value: 'unknown', label: 'Not Known'}
              ]}
              selectedOption={smoker}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormSelect
              title="Diabetic"
              name="diabetic"
              value={diabetic}
              options={[
                {
                  value: 'dietAlone',
                  label: 'Diet alone'
                },
                {
                  value: 'tablets',
                  label: 'Tablets'
                },
                {
                  value: 'insulin',
                  label: 'Insulin'
                },
                {
                  value: 'InsulinTablets',
                  label: 'Insulin+tablets'
                },
                {
                  value: 'notKnown',
                  label: 'Not known'
                }
              ]}
              onChange={(e) => this.handleChange(e)}
            />
          </FormRow>
          <FormRow>
            <FormSelect
              title="HIV status"
              name="hivStatus"
              value={hivStatus}
              options={[
                {
                  value: 'testedNegative',
                  label: 'Tested, negative'
                },
                {
                  value: 'testedPositive',
                  label: 'Tested, positive'
                },
                {
                  value: 'notTested',
                  label: 'Not tested'
                },
                {
                  value: 'NotKnown',
                  label: 'Not known'
                }
              ]}
              onChange={(e) => this.handleChange(e)}
            />
          </FormRow>
          <FormRow>
            <FormInputRadio
              title="If HIV-positive, on ART at time of diagnosis?"
              name="art"
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'},
                {value: 'unknown', label: 'Not Known'}
              ]}
              selectedOption={art}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
        </Fieldset>

        <Fieldset legend="Lab">
          <FormRow>
            <FormInputText
              title="Lab ID"
              name="labId"
              type="text"
              value={labId}
              required
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormInputText
              title="Isolate ID"
              name="isolateId"
              type="text"
              value={isolateId}
              required
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormInputDate
              title="Collection date"
              name="collectionDate"
              value={collectionDate}
              required
              onChange={(date) => this.handleDateChange('collectionDate', date)}
            />
          </FormRow>
          <FormRow>
            <FormInputRadio
              title="Has this isolate been collected prospectively?"
              name="prospectiveIsolate"
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'}
              ]}
              selectedOption={prospectiveIsolate}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>

        </Fieldset>

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
    setMetadata: MetadataActions.setMetadata
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MetadataForm);
