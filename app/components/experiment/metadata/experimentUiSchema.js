/* @flow */

import * as React from 'react';

import {
  Select,
  DatePicker,
  DateTimePicker,
} from 'makeandship-js-common/src/components/ui/form';

import { experimentSchema } from '../../../schemas/experiment';

const inlineRadioUiSchema = {
  'ui:widget': 'radio',
  'ui:options': {
    inline: true,
  },
  'ui:layout': {
    md: 9,
  },
};

const datePickerUiSchema = {
  'ui:widget': DatePicker,
  'ui:layout': {
    md: 3,
  },
};

const dateTimePickerUiSchema = {
  'ui:widget': props => <DateTimePicker inline={false} {...props} />,
  'ui:layout': {
    md: 6, // TODO: setting this to 3 breaks popup layout
  },
};

const selectUiSchema = {
  'ui:widget': Select,
};

const uiSchema = {
  metadata: {
    patient: {
      genderAtBirth: inlineRadioUiSchema,
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
      countryOfBirth: selectUiSchema,
      injectingDrugUse: inlineRadioUiSchema,
      homeless: inlineRadioUiSchema,
      imprisoned: inlineRadioUiSchema,
      smoker: inlineRadioUiSchema,
      diabetic: selectUiSchema,
      hivStatus: selectUiSchema,
    },
    sample: {
      collectionDate: datePickerUiSchema,
      prospectiveIsolate: inlineRadioUiSchema,
      countryIsolate: selectUiSchema,
      dateArrived: datePickerUiSchema,
      anatomicalOrigin: selectUiSchema,
      smear: selectUiSchema,
    },
    genotyping: {
      wgsPlatform: inlineRadioUiSchema,
      otherGenotypeInformation: inlineRadioUiSchema,
      genexpert: inlineRadioUiSchema,
      hain: inlineRadioUiSchema,
      hainRif: inlineRadioUiSchema,
      hainInh: inlineRadioUiSchema,
      hainFl: inlineRadioUiSchema,
      hainAm: inlineRadioUiSchema,
      hainEth: inlineRadioUiSchema,
    },
    phenotyping: {
      phenotypeInformationFirstLineDrugs: inlineRadioUiSchema,
      phenotypeInformationOtherDrugs: inlineRadioUiSchema,
    },
    treatment: {
      previousTbInformation: inlineRadioUiSchema,
      recentMdrTb: inlineRadioUiSchema,
      tbProphylaxis: inlineRadioUiSchema,
      currentTbInformation: inlineRadioUiSchema,
      startProgrammaticTreatment: inlineRadioUiSchema,
      startProgrammaticContinuationTreatment: inlineRadioUiSchema,
      nonStandardTreatment: inlineRadioUiSchema,
    },
    outcome: {
      sputumSmearConversion: selectUiSchema,
      sputumCultureConversion: selectUiSchema,
      whoOutcomeCategory: selectUiSchema,
      dateOfDeath: datePickerUiSchema,
    },
  },
};

// phenotyping ui

Object.entries(experimentSchema.definitions.Phenotyping.properties).forEach(
  ([key, value]) => {
    if (value.$ref && value.$ref === '#/definitions/Susceptibility') {
      uiSchema.metadata.phenotyping[key] = {
        susceptibility: inlineRadioUiSchema,
        method: inlineRadioUiSchema,
      };
    }
  }
);

// treatment ui

Object.entries(experimentSchema.definitions.Treatment.properties).forEach(
  ([key, value]) => {
    if (value.format && value.format === 'date-time') {
      uiSchema.metadata.treatment[key] = dateTimePickerUiSchema;
    }
    if (value.$ref && value.$ref === '#/definitions/DrugPhase') {
      uiSchema.metadata.treatment[key] = {
        start: dateTimePickerUiSchema,
        stop: dateTimePickerUiSchema,
      };
    }
  }
);

export default uiSchema;
