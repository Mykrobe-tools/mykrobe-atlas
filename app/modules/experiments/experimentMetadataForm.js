/* @flow */

import { createSelector } from 'reselect';

import { getFormData } from 'makeandship-js-common/src/modules/form';

import {
  experimentMetadataSchema,
  completenessForSchemaAndData,
} from '../../schemas/experiment';

export const EXPERIMENT_METADATA_FORM_ID = 'experiments/experiment/metadata';

// Selectors

export const getExperimentMetadataFormData = (state) => {
  return getFormData(state, EXPERIMENT_METADATA_FORM_ID);
};

export const getExperimentMetadataFormCompletion = createSelector(
  getExperimentMetadataFormData,
  (formData) => completenessForSchemaAndData(experimentMetadataSchema, formData)
);
