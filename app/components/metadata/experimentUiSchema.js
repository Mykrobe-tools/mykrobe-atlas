/* @flow */

import * as React from 'react';

import {
  Select,
  DatePicker,
  DateTimePicker,
} from 'makeandship-js-common/src/components/ui/form';

import experimentSchema from 'mykrobe-atlas-api/src/schemas/experiment';

const inlineRadioSchema = {
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

const uiSchema = {
  metadata: {
    patient: {
      genderAtBirth: inlineRadioSchema,
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
      injectingDrugUse: inlineRadioSchema,
      homeless: inlineRadioSchema,
      imprisoned: inlineRadioSchema,
      smoker: inlineRadioSchema,
      diabetic: {
        'ui:widget': Select,
      },
      hivStatus: {
        'ui:widget': Select,
      },
    },
    sample: {
      collectionDate: datePickerUiSchema,
      prospectiveIsolate: inlineRadioSchema,
      countryIsolate: {
        'ui:widget': Select,
      },
      dateArrived: datePickerUiSchema,
      anatomicalOrigin: {
        'ui:widget': Select,
      },
      smear: {
        'ui:widget': Select,
      },
    },
    genotyping: {
      wgsPlatform: inlineRadioSchema,
      otherGenotypeInformation: inlineRadioSchema,
      genexpert: inlineRadioSchema,
      hain: inlineRadioSchema,
      hainRif: inlineRadioSchema,
      hainInh: inlineRadioSchema,
      hainFl: inlineRadioSchema,
      hainAm: inlineRadioSchema,
      hainEth: inlineRadioSchema,
    },
    phenotyping: {
      phenotypeInformationFirstLineDrugs: inlineRadioSchema,
      phenotypeInformationOtherDrugs: inlineRadioSchema,
    },
    treatment: {},
  },
};

// phenotyping ui

Object.entries(experimentSchema.definitions.Phenotyping.properties).forEach(
  ([key, value]) => {
    if (value.$ref && value.$ref === '#/definitions/Susceptibility') {
      uiSchema.metadata.phenotyping[key] = {
        susceptibility: inlineRadioSchema,
        method: inlineRadioSchema,
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
