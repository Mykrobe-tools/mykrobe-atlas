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
// import FormTextarea from '../form/FormTextarea';
import FormInputRadio from '../form/FormInputRadio';
// import FormInputCheckbox from '../form/FormInputCheckbox';
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
    patientAge: number,
    countryIsolate: string,
    cityIsolate: string,
    dateArrived: string,
    anatomicalOrigin: string,
    smear: string,
    wgsPlatform: string,
    wgsPlatformOther: string,
    otherGenotypeInformation: boolean,
    genexpert: string,
    hain: string,
    hainRif: string,
    hainInh: string,
    hainFl: string,
    hainAm: string,
    hainEth: string,
    phenotypeInformationFirstLineDrugs: boolean,
    phenotypeInformationOtherDrugs: boolean,
    susceptibility: Object,
    susceptibilityNotTestedReason: Object,
    previousTbinformation: boolean,
    recentMdrTb: string,
    priorTreatmentDate: string,
    tbProphylaxis: string,
    tbProphylaxisDate: string,
    currentTbinformation: boolean,
    startProgrammaticTreatment: boolean,
    intensiveStartDate: string,
    intensiveStopDate: string,
    startProgrammaticContinuationTreatment: string,
    continuationStartDate: string,
    continuationStopDate: string,
    nonStandardTreatment: string,
    drugOutsidePhase: Object,
    drugOutsidePhaseStartDate: Object,
    drugOutsidePhaseEndDate: Object,
    sputumSmearConversion: string,
    sputumCultureConversion: string,
    whoOutcomeCategory: string,
    dateOfDeath: string
  };

  constructor(props: Object) {
    super(props);
    this.state = props.metadata;

    // const app = require('electron').remote.app;
    // const locale = app.getLocale();
    // console.log('locale', locale); // returns en-US
  }

  componentWillUnmount() {
    const {setMetadata} = this.props;
    setMetadata(this.state);
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const {id, postMetadataForm} = this.props;

    // TODO: Error checking

    postMetadataForm(id, this.state);
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

  handleSusceptibilityChange(drug: string, event: InputEvent) {
    var state = {};
    state.susceptibility = Object.assign({}, this.state.susceptibility, {
      [drug]: event.target.value
    });
    this.setState(state);
  }

  handleSusceptibilityNotTestedChange(drug: string, event: InputEvent) {
    var state = {};
    state.susceptibilityNotTestedReason = Object.assign({}, this.state.susceptibilityNotTestedReason, {
      [drug]: event.target.value
    });
    this.setState(state);
    console.log('state:', this.state);
  }

  handleDrugOutsidePhaseChange(drug: string, event: InputEvent) {
    var state = {};
    state.drugOutsidePhase = Object.assign({}, this.state.drugOutsidePhase, {
      [drug]: event.target.value
    });
    this.setState(state);
  }

  handleDrugOutsidePhaseStartDateChange(drug: string, date: moment) {
    var state = {};
    state.drugOutsidePhaseStartDate = Object.assign({}, this.state.drugOutsidePhaseStartDate, {
      [drug]: date.format()
    });
    this.setState(state);
  }

  handleDrugOutsidePhaseEndDateChange(drug: string, date: moment) {
    var state = {};
    state.drugOutsidePhaseEndDate = Object.assign({}, this.state.drugOutsidePhaseEndDate, {
      [drug]: date.format()
    });
    this.setState(state);
  }

  render() {
    const { patientId, siteId, genderAtBirth, countryOfBirth, bmi, injectingDrugUse, homeless, imprisoned, smoker, diabetic, hivStatus, art, labId, isolateId, collectionDate, prospectiveIsolate, patientAge, countryIsolate, cityIsolate, dateArrived, anatomicalOrigin, smear, wgsPlatform, wgsPlatformOther, otherGenotypeInformation, genexpert, hain, hainRif, hainInh, hainFl, hainAm, hainEth, phenotypeInformationFirstLineDrugs, phenotypeInformationOtherDrugs, previousTbinformation, recentMdrTb, priorTreatmentDate, tbProphylaxis, tbProphylaxisDate, currentTbinformation, startProgrammaticTreatment, intensiveStartDate, intensiveStopDate, startProgrammaticContinuationTreatment, continuationStartDate, continuationStopDate, nonStandardTreatment, sputumSmearConversion, sputumCultureConversion, whoOutcomeCategory, dateOfDeath, drugOutsidePhase, drugOutsidePhaseStartDate, drugOutsidePhaseEndDate } = this.state;
    const {template} = this.props;

    return (
      <Form onSubmit={(event) => this.handleSubmit(event)}>
        <Fieldset legend="Patient">
          {template.includes('patientId') &&
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
          }
          {template.includes('siteId') &&
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
          }
          {template.includes('genderAtBirth') &&
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
          }
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
          <FormRow>
            <FormInputText
              title="Patient Age"
              name="patientAge"
              type="text"
              value={patientAge}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormTypeahead
              title="Country where isolate taken"
              name="countryIsolate"
              value={countryIsolate}
              required
              suggestions={locations.map((location, index) => {
                return ({
                  value: location['alpha-2'],
                  label: location.name
                });
              })}
              onChange={(name, value) => this.handleTypeaheadChange(name, value)}
            />
          </FormRow>
          <FormRow>
            <FormInputText
              title="City where isolate taken"
              name="cityIsolate"
              type="text"
              value={cityIsolate}
              required
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormInputDate
              title="Date arrived in country where isolate was taken"
              name="dateArrived"
              value={dateArrived}
              onChange={(date) => this.handleDateChange('dateArrived', date)}
            />
          </FormRow>
          <FormRow>
            <FormSelect
              title="Anatomical origin"
              name="anatomicalOrigin"
              value={anatomicalOrigin}
              options={[
                {
                  value: 'respiratory',
                  label: 'Respiratory'
                },
                {
                  value: 'lymphNode',
                  label: 'Lymph node'
                },
                {
                  value: 'csf',
                  label: 'CSF'
                },
                {
                  value: 'gastric',
                  label: 'Gastric'
                },
                {
                  value: 'bone',
                  label: 'Bone'
                },
                {
                  value: 'otherKnownSite',
                  label: 'Other known site'
                },
                {
                  value: 'NonRespiratory',
                  label: 'Non-respiratory, site not known'
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
              title="Smear"
              name="smear"
              value={smear}
              options={[
                {
                  value: 'negative',
                  label: 'Negative'
                },
                {
                  value: '+',
                  label: '+'
                },
                {
                  value: '++',
                  label: '++'
                },
                {
                  value: '+++',
                  label: '+++'
                },
                {
                  value: 'notKnown',
                  label: 'Not known'
                }
              ]}
              onChange={(e) => this.handleChange(e)}
            />
          </FormRow>
        </Fieldset>
        <Fieldset legend="Genotyping">
          <FormRow>
            <FormSelect
              title="WGS Platform"
              name="wgsPlatform"
              value={wgsPlatform}
              required
              options={[
                {
                  value: 'hiSeq',
                  label: 'HiSeq'
                },
                {
                  value: 'miSeq',
                  label: 'MiSeq'
                },
                {
                  value: 'nextSeq',
                  label: 'NextSeq'
                },
                {
                  value: 'other',
                  label: 'Other'
                }
              ]}
              onChange={(e) => this.handleChange(e)}
            />
          </FormRow>
          <FormRow>
            <FormInputText
              title="WGS Platform (other)"
              name="wgsPlatformOther"
              type="text"
              value={wgsPlatformOther}
              required
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormInputRadio
              title="Do you have other genotype information(eg GeneXpert, HAIN?)"
              name="otherGenotypeInformation"
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'}
              ]}
              selectedOption={otherGenotypeInformation}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormSelect
              title="GeneXpert"
              name="genexpert"
              value={genexpert}
              options={[
                {
                  value: 'rifSensitive',
                  label: 'RIF sensitive'
                },
                {
                  value: 'rifResistant',
                  label: 'RIF resistant'
                },
                {
                  value: 'inconclusive',
                  label: 'Inconclusive'
                },
                {
                  value: 'notTested',
                  label: 'Not tested'
                }
              ]}
              onChange={(e) => this.handleChange(e)}
            />
          </FormRow>
          <FormRow>
            <FormSelect
              title="HAIN"
              name="hain"
              value={hain}
              options={[
                {
                  value: 'InhRifTest',
                  label: 'INH/RIF test'
                },
                {
                  value: 'fluoroquinoloneAminoglycosideEthambutolTest',
                  label: 'Fluoroquinolone/aminoglycoside/ethambutol test'
                },
                {
                  value: 'both',
                  label: 'Both'
                },
                {
                  value: 'notTested',
                  label: 'Not tested'
                }
              ]}
              onChange={(e) => this.handleChange(e)}
            />
          </FormRow>
          <FormRow>
            <FormSelect
              title="HAIN RIF"
              name="hainRif"
              value={hainRif}
              options={[
                {
                  value: 'rifSensitive',
                  label: 'RIF sensitive'
                },
                {
                  value: 'rifResistant',
                  label: 'RIF resistant'
                },
                {
                  value: 'rifInconclusive',
                  label: 'RIF inconclusive'
                },
                {
                  value: 'rifTestFailed',
                  label: 'RIF test failed'
                }
              ]}
              onChange={(e) => this.handleChange(e)}
            />
          </FormRow>
          <FormRow>
            <FormSelect
              title="HAIN INH"
              name="hainInh"
              value={hainInh}
              options={[
                {
                  value: 'inhSensitive',
                  label: 'INH sensitive'
                },
                {
                  value: 'inhResistant',
                  label: 'INH resistant'
                },
                {
                  value: 'inhInconclusive',
                  label: 'INH inconclusive'
                },
                {
                  value: 'inhTestFailed',
                  label: 'INH test failed'
                }
              ]}
              onChange={(e) => this.handleChange(e)}
            />
          </FormRow>
          <FormRow>
            <FormSelect
              title="HAIN FL"
              name="hainFl"
              value={hainFl}
              options={[
                {
                  value: 'flSensitive',
                  label: 'FL sensitive'
                },
                {
                  value: 'flResistant',
                  label: 'FL resistant'
                },
                {
                  value: 'flInconclusive',
                  label: 'FL inconclusive'
                },
                {
                  value: 'flTestFailed',
                  label: 'FL test failed'
                }
              ]}
              onChange={(e) => this.handleChange(e)}
            />
          </FormRow>
          <FormRow>
            <FormSelect
              title="HAIN AM"
              name="hainAm"
              value={hainAm}
              options={[
                {
                  value: 'amSensitive',
                  label: 'AM sensitive'
                },
                {
                  value: 'amResistant',
                  label: 'AM resistant'
                },
                {
                  value: 'amInconclusive',
                  label: 'AM inconclusive'
                },
                {
                  value: 'amTestFailed',
                  label: 'AM test failed'
                }
              ]}
              onChange={(e) => this.handleChange(e)}
            />
          </FormRow>
          <FormRow>
            <FormSelect
              title="HAIN ETH"
              name="hainEth"
              value={hainEth}
              options={[
                {
                  value: 'ethSensitive',
                  label: 'ETH sensitive'
                },
                {
                  value: 'ethResistant',
                  label: 'ETH resistant'
                },
                {
                  value: 'ethInconclusive',
                  label: 'ETH inconclusive'
                },
                {
                  value: 'ethTestFailed',
                  label: 'ETH test failed'
                }
              ]}
              onChange={(e) => this.handleChange(e)}
            />
          </FormRow>
        </Fieldset>
        <Fieldset legend="Phenotype">
          <FormRow>
            <FormInputRadio
              title="Do you have local phenotype information on first-line drugs (HZRE)?"
              name="phenotypeInformationFirstLineDrugs"
              required
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'}
              ]}
              selectedOption={phenotypeInformationFirstLineDrugs}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <div className={styles.susceptibilityWrap}>
              <div className={styles.susceptibilityLabel}>
                <FormLabel label="Phenotype resistance and method" />
              </div>
              <div className={styles.susceptibilityRows}>
                {this.resistanceOptionsForDrugs(drugs.main)}
              </div>
            </div>
          </FormRow>
          <FormRow>
            <FormInputRadio
              title="Do you have local phenotype information on any other drugs?"
              name="phenotypeInformationOtherDrugs"
              required
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'}
              ]}
              selectedOption={phenotypeInformationOtherDrugs}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <div className={styles.susceptibilityWrap}>
              <div className={styles.susceptibilityLabel}>
                <FormLabel label="Phenotype resistance" />
              </div>
              <div className={styles.susceptibilityRows}>
                {this.resistanceOptionsForDrugs(drugs.other)}
              </div>
            </div>
          </FormRow>
        </Fieldset>
        <Fieldset legend="Previous TB Treatment or prophylaxis (for infection strictly prior to this current episode)">
          <FormRow>
            <FormInputRadio
              title="Is any information known about previous TB treatment?"
              name="previousTbinformation"
              required
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'}
              ]}
              selectedOption={previousTbinformation}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormInputRadio
              title="Was the most recent prior treatment for MDR TB?"
              name="recentMdrTb"
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'},
                {value: 'notKnown', label: 'Not Known'}
              ]}
              selectedOption={recentMdrTb}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormInputDate
              title="When did the most recent prior treatment for TB stop?"
              name="priorTreatmentDate"
              value={priorTreatmentDate}
              required
              onChange={(date) => this.handleDateChange('priorTreatmentDate', date)}
            />
          </FormRow>
          <FormRow>
            <FormInputRadio
              title="Has the patient ever received TB prophylaxis?"
              name="tbProphylaxis"
              required
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'},
                {value: 'notKnown', label: 'Not Known'}
              ]}
              selectedOption={tbProphylaxis}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormInputDate
              title="If yes, when did the most recent prior prophylaxis stop?"
              name="tbProphylaxisDate"
              value={tbProphylaxisDate}
              required
              onChange={(date) => this.handleDateChange('tbProphylaxisDate', date)}
            />
          </FormRow>
        </Fieldset>
        <Fieldset legend="Current TB treatment (at isolation)">
          <FormRow>
            <FormInputRadio
              title="Do you have information about current TB treatment for this TB episode?"
              name="currentTbinformation"
              required
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'}
              ]}
              selectedOption={currentTbinformation}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormInputRadio
              title="Did the patient start standard programmatic treatment for drug susceptible TB (intensive HZRE)?"
              name="startProgrammaticTreatment"
              required
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'}
              ]}
              selectedOption={startProgrammaticTreatment}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormInputDate
              title="Standard intensive phase first start date"
              name="intensiveStartDate"
              value={intensiveStartDate}
              onChange={(date) => this.handleDateChange('intensiveStartDate', date)}
            />
          </FormRow>
          <FormRow>
            <FormInputDate
              title="Standard intensive phase final stop date"
              name="intensiveStopDate"
              value={intensiveStopDate}
              onChange={(date) => this.handleDateChange('intensiveStopDate', date)}
            />
          </FormRow>
          <FormRow>
            <FormInputRadio
              title="Did the patient start standard programmatic continuation treatment for drug susceptible TB (HR)?"
              name="startProgrammaticContinuationTreatment"
              required
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'},
                {value: 'notKnown', label: 'Not Known'}
              ]}
              selectedOption={startProgrammaticContinuationTreatment}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
          <FormRow>
            <FormInputDate
              title="Standard continuation phase first start date"
              name="continuationStartDate"
              value={continuationStartDate}
              onChange={(date) => this.handleDateChange('continuationStartDate', date)}
            />
          </FormRow>
          <FormRow>
            <FormInputDate
              title="Standard continuation phase first stop date"
              name="continuationStopDate"
              value={continuationStopDate}
              onChange={(date) => this.handleDateChange('continuationStopDate', date)}
            />
          </FormRow>
          <FormRow>
            <FormInputRadio
              title="Did the patient ever take non-standard intensive/continuation phase treatment (eg for MDR-TB)?"
              name="nonStandardTreatment"
              required
              options={[
                {value: 'yes', label: 'Yes'},
                {value: 'no', label: 'No'},
                {value: 'notKnown', label: 'Not Known'}
              ]}
              selectedOption={nonStandardTreatment}
              onChange={(event) => this.handleChange(event)}
            />
          </FormRow>
        </Fieldset>
        <Fieldset legend="Drugs ever taken outside of standard intensive/continuation phase">
          <FormRow>
            <div className={styles.susceptibilityWrap}>
              <div className={styles.susceptibilityLabel}>
                <FormLabel label="" />
              </div>
              <div className={styles.susceptibilityRows}>
                {drugs.outside.map((drug, index) => {
                  const selectedOption = drugOutsidePhase && drugOutsidePhase[drug] || '';
                  const isYes = selectedOption === 'yes';
                  let startDate, endDate;
                  if (isYes) {
                    startDate = drugOutsidePhaseStartDate && drugOutsidePhaseStartDate[drug] || '';
                    endDate = drugOutsidePhaseEndDate && drugOutsidePhaseEndDate[drug] || '';
                  }
                  return (
                    <div key={index} className={styles.susceptibilityRow}>
                      <FormInputRadio
                        title={drug}
                        options={[
                          {value: 'yes', label: 'Yes'},
                          {value: 'no', label: 'No'}
                        ]}
                        selectedOption={selectedOption}
                        onChange={(event) => this.handleDrugOutsidePhaseChange(drug, event)}
                      />
                      {isYes && (
                        <div>
                          <FormInputDate
                            title="Start date"
                            value={startDate}
                            onChange={(date) => this.handleDrugOutsidePhaseStartDateChange(drug, date)}
                          />
                          <FormInputDate
                            title="End date"
                            value={endDate}
                            onChange={(date) => this.handleDrugOutsidePhaseEndDateChange(drug, date)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </FormRow>
          <FormRow>
            <FormSelect
              title="Sputum smear conversion at 2-3 months"
              name="sputumSmearConversion"
              value={sputumSmearConversion}
              options={[
                {
                  value: 'Sputum smear negative at 2-3 months',
                  label: 'Sputum smear negative at 2-3 months'
                },
                {
                  value: 'Sputum smear positive at 2-3 months',
                  label: 'Sputum smear positive at 2-3 months'
                },
                {
                  value: 'Not known or not done',
                  label: 'Not known or not done'
                }
              ]}
              onChange={(e) => this.handleChange(e)}
            />
          </FormRow>
          <FormRow>
            <FormSelect
              title="Sputum culture conversion at 2-3 months"
              name="sputumCultureConversion"
              value={sputumCultureConversion}
              options={[
                {
                  value: 'Sputum smear negative at 2-3 months',
                  label: 'Sputum smear negative at 2-3 months'
                },
                {
                  value: 'Sputum smear positive at 2-3 months',
                  label: 'Sputum smear positive at 2-3 months'
                },
                {
                  value: 'Not known or not done',
                  label: 'Not known or not done'
                }
              ]}
              onChange={(e) => this.handleChange(e)}
            />
          </FormRow>
        </Fieldset>
        <Fieldset legend="Outcome data for this TB episode">
          <FormRow>
            <FormSelect
              title="WHO outcome category"
              name="whoOutcomeCategory"
              value={whoOutcomeCategory}
              options={[
                {
                  value: 'Cured',
                  label: 'Cured'
                },
                {
                  value: 'Treatment completed',
                  label: 'Treatment completed'
                },
                {
                  value: 'Treatment failed',
                  label: 'Treatment failed'
                },
                {
                  value: 'Died',
                  label: 'Died'
                },
                {
                  value: 'Lost to follow-up or defaulted',
                  label: 'Lost to follow-up or defaulted'
                },
                {
                  value: 'Not evaluated',
                  label: 'Not evaluated'
                },
                {
                  value: 'Treatment success',
                  label: 'Treatment success'
                },
                {
                  value: 'Not known',
                  label: 'Not known'
                }
              ]}
              onChange={(e) => this.handleChange(e)}
            />
          </FormRow>
          <FormRow>
            <FormInputDate
              title="Date of Death"
              name="dateOfDeath"
              value={dateOfDeath}
              required
              onChange={(date) => this.handleDateChange('dateOfDeath', date)}
            />
          </FormRow>
        </Fieldset>
        <FormRow>
          <FormButton
            type="submit"
            label="Save"
          />
        </FormRow>
      </Form>
    );
  }

  resistanceOptionsForDrugs(drugs: Object) {
    const {susceptibility, susceptibilityNotTestedReason} = this.state;
    return drugs.map((drug, index) => {
      const selectedOption = susceptibility && susceptibility[drug] || '';
      const notTested = selectedOption === 'U';
      let notTestedReason = '';
      if (notTested) {
        notTestedReason = susceptibilityNotTestedReason && susceptibilityNotTestedReason[drug] || '';
      }
      return (
        <div key={index} className={styles.susceptibilityRow}>
          <FormInputRadio
            title={drug}
            options={[
              {value: 'S', label: 'Susceptible'},
              {value: 'R', label: 'Resistant'},
              {value: 'I', label: 'Inconclusive'},
              {value: 'U', label: 'Not tested'}
            ]}
            selectedOption={susceptibility[drug]}
            onChange={(event) => this.handleSusceptibilityChange(drug, event)}
          />
          {notTested && (
            <FormSelect
              title="Not tested reason"
              placeholder="Select reason"
              value={notTestedReason}
              options={[
                {
                  value: 'MGIT',
                  label: 'MGIT'
                },
                {
                  value: 'LJ',
                  label: 'LJ'
                },
                {
                  value: 'Microtitre plate',
                  label: 'Microtitre plate'
                },
                {
                  value: 'MODS',
                  label: 'MODS'
                },
                {
                  value: 'Other',
                  label: 'Other'
                },
                {
                  value: 'Not known',
                  label: 'Not known'
                }
              ]}
              onChange={(event) => this.handleSusceptibilityNotTestedChange(drug, event)}
            />
          )}
        </div>
      );
    });
  }
}

function mapStateToProps(state) {
  return {
    metadata: state.metadata.metadata,
    template: state.metadata.template
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    postMetadataForm: MetadataActions.postMetadataForm,
    setMetadata: MetadataActions.setMetadata
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MetadataForm);
