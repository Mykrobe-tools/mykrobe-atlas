/* @flow */

import { createSelector } from 'reselect';

import { FETCH_JSON } from '../api';
import { BASE_URL } from '../../constants/APIConstants.js';
import * as StringHelpers from '../../helpers/StringHelpers';

export const typePrefix = 'experiments/experiments/';
export const FETCH_EXPERIMENTS = `${typePrefix}FETCH_EXPERIMENTS`;
export const FETCH_EXPERIMENTS_SUCCESS = `${typePrefix}FETCH_EXPERIMENTS_SUCCESS`;
export const FETCH_EXPERIMENTS_FAILURE = `${typePrefix}FETCH_EXPERIMENTS_FAILURE`;

export const PREPARE_NEW_EXPERIMENT = `${typePrefix}PREPARE_NEW_EXPERIMENT`;
export const PREPARE_NEW_EXPERIMENT_SUCCESS = `${typePrefix}PREPARE_NEW_EXPERIMENT_SUCCESS`;
export const PREPARE_NEW_EXPERIMENT_FAILURE = `${typePrefix}PREPARE_NEW_EXPERIMENT_FAILURE`;

export const UPLOAD_EXPERIMENT_FILE = `${typePrefix}UPLOAD_EXPERIMENT_FILE`;
export const UPLOAD_EXPERIMENT_FILE_SUCCESS = `${typePrefix}UPLOAD_EXPERIMENT_FILE_SUCCESS`;
export const UPLOAD_EXPERIMENT_FILE_FAILURE = `${typePrefix}UPLOAD_EXPERIMENT_FILE_FAILURE`;

// Selectors

export const getState = state => state.experiments.experiments;
export const getExperiments = createSelector(
  getState,
  experiments => experiments
);
export const getIsFetching = createSelector(
  getState,
  experiments => experiments.isFetching
);
export const getSamples = createSelector(
  getState,
  experiments => experiments.samples
);
export const getTotal = createSelector(
  getState,
  experiments => experiments.total
);

// Reducer

export const initialState = {
  isFetching: false,
  samples: [],
  total: 0,
};

export default function reducer(
  state: Object = initialState,
  action: Object = {}
) {
  console.log('action', action);
  switch (action.type) {
    case FETCH_EXPERIMENTS:
      return {
        ...state,
        isFetching: true,
        samples: [],
        total: null,
      };
    case FETCH_EXPERIMENTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        samples: action.payload.results,
        total: action.payload.summary.hits,
      };
    default:
      return state;
  }
}

// Side effects

export function fetchExperiments(filters: Object = {}) {
  return async (dispatch: Function) => {
    const params = StringHelpers.objectToParamString(filters);
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/experiments/search?${params}`,
        types: [
          FETCH_EXPERIMENTS,
          FETCH_EXPERIMENTS_SUCCESS,
          FETCH_EXPERIMENTS_FAILURE,
        ],
      },
    });
    return payload;
  };
}

// retreive an empty experiment with an id for a new experiment upload

export function prepareNewExperiment() {
  return async (dispatch: Function) => {
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/experiments/`,
        options: {
          method: 'POST',
        },
        types: [
          PREPARE_NEW_EXPERIMENT,
          PREPARE_NEW_EXPERIMENT_SUCCESS,
          PREPARE_NEW_EXPERIMENT_FAILURE,
        ],
      },
    });
    return payload;
  };
}

// basic file upload to an experiment

export function uploadExperimentFile(id: string, file: Object) {
  return async (dispatch: Function) => {
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/experiments/${id}/file`,
        options: {
          method: 'PUT',
          body: JSON.stringify(file),
        },
        types: [
          UPLOAD_EXPERIMENT_FILE,
          UPLOAD_EXPERIMENT_FILE_SUCCESS,
          UPLOAD_EXPERIMENT_FILE_FAILURE,
        ],
      },
    });
    return payload;
  };
}
