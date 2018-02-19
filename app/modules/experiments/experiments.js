/* @flow */

import { createSelector } from 'reselect';

import { fetchJson } from '../api';
import { showNotification, NotificationCategories } from '../notifications';
import { BASE_URL } from '../../constants/APIConstants.js';
import * as StringHelpers from '../../helpers/StringHelpers';

export const typePrefix = 'experiments/experiments/';
export const REQUEST_EXPERIMENTS = `${typePrefix}REQUEST_EXPERIMENTS`;
export const RECEIVE_EXPERIMENTS = `${typePrefix}RECEIVE_EXPERIMENTS`;

export const PREPARE_NEW_EXPERIMENT = `${typePrefix}PREPARE_NEW_EXPERIMENT`;
export const PREPARE_NEW_EXPERIMENT_SUCCESS = `${typePrefix}PREPARE_NEW_EXPERIMENT_SUCCESS`;
export const PREPARE_NEW_EXPERIMENT_FAILURE = `${typePrefix}PREPARE_NEW_EXPERIMENT_FAILURE`;

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
    case REQUEST_EXPERIMENTS:
      return {
        ...state,
        isFetching: true,
        samples: [],
        total: null,
      };
    case RECEIVE_EXPERIMENTS:
      return {
        ...state,
        isFetching: false,
        samples: action.data.results,
        total: action.data.summary.hits,
      };
    default:
      return state;
  }
}

// Action creators

export function requestExperiments() {
  return {
    type: REQUEST_EXPERIMENTS,
  };
}

export function receiveExperiments(
  data: Object = { results: [], summary: { hits: 0 } }
) {
  return {
    type: RECEIVE_EXPERIMENTS,
    data,
  };
}

// Side effects

export function fetchExperiments(filters: Object = {}) {
  return (dispatch: Function) => {
    dispatch(requestExperiments());
    const params = StringHelpers.objectToParamString(filters);
    return dispatch(fetchJson(`${BASE_URL}/experiments/search?${params}`))
      .then(data => {
        setTimeout(() => {
          dispatch(receiveExperiments(data));
          return Promise.resolve(data);
        }, 3000);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: statusText,
            autoHide: false,
          })
        );
        dispatch(receiveExperiments());
        return Promise.reject(error);
      });
  };
}

// retreive an empty experiment with an id for a new experiment upload

export function prepareNewExperiment() {
  return (dispatch: Function) => {
    dispatch({
      type: PREPARE_NEW_EXPERIMENT,
    });
    return dispatch(
      fetchJson(`${BASE_URL}/experiments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).then(data => {
      dispatch({
        type: PREPARE_NEW_EXPERIMENT_SUCCESS,
        experiment: data,
      });
      return Promise.resolve(data);
    });
  };
}

// basic file upload to an experiment

export function uploadExperimentFile(id: string, file: Object) {
  return (dispatch: Function) => {
    return dispatch(
      fetchJson(`${BASE_URL}/experiments/${id}/file`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(file),
      })
    );
  };
}
