/* @flow */

import * as React from 'react';
import moment from 'moment';

import {
  Select,
  DatePicker,
  DateTimePicker,
} from 'makeandship-js-common/src/components/ui/form';

import { experimentSchema } from '../../../schemas/experiment';

const radioWidget = (props: any) => {
  if (props.readonly) {
    const { TextWidget } = props.registry.widgets;
    return <TextWidget {...props} />;
  } else {
    const { RadioWidget } = props.registry.widgets;
    return <RadioWidget {...props} />;
  }
};

const inlineRadioUiSchema = {
  'ui:widget': radioWidget,
  'ui:options': {
    inline: true,
  },
  'ui:layout': {
    md: 9,
  },
};

const datePickerWidget = (props: any) => {
  if (props.readonly) {
    const { TextWidget } = props.registry.widgets;
    const { value, ...rest } = props;
    const formattedValue = value
      ? moment(value).format(DatePicker.defaultProps.dateFormat)
      : '';
    return <TextWidget value={formattedValue} {...rest} />;
  } else {
    return <DatePicker {...props} />;
  }
};

const datePickerUiSchema = {
  'ui:widget': datePickerWidget,
  'ui:layout': {
    md: 3,
  },
};

const dateTimePickerWidget = (props: any) => {
  if (props.readonly) {
    const { TextWidget } = props.registry.widgets;
    const { value, ...rest } = props;
    const formattedValue = value
      ? moment(value).format(DateTimePicker.defaultProps.dateFormat)
      : '';
    return <TextWidget value={formattedValue} {...rest} />;
  } else {
    return <DateTimePicker inline={false} {...props} />;
  }
};

const dateTimePickerUiSchema = {
  'ui:widget': dateTimePickerWidget,
  'ui:layout': {
    md: 6, // TODO: setting this to 3 breaks popup layout
  },
};

const selectWidget = (props: any) => {
  if (props.readonly) {
    const { TextWidget } = props.registry.widgets;
    return <TextWidget {...props} />;
  } else {
    return <Select {...props} />;
  }
};

const selectUiSchema = {
  'ui:widget': selectWidget,
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
