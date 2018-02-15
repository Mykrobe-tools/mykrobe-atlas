/* @flow */

import { createSelector } from 'reselect';

import fetchJson from '../../api/fetchJson';
import { showNotification, NotificationCategories } from '../notifications';
import { BASE_URL } from '../../constants/APIConstants.js';
import * as StringHelpers from '../../helpers/StringHelpers';

export const typePrefix = 'experiments/experiments/';
export const REQUEST_EXPERIMENTS = `${typePrefix}REQUEST_EXPERIMENTS`;
export const RECEIVE_EXPERIMENTS = `${typePrefix}RECEIVE_EXPERIMENTS`;

// Selectors

export const getState = state => state.notifications.notifications;
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
// Recuder

const initialState = {
  isFetching: false,
  samples: [],
  total: 0,
};

export default function reducer(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case REQUEST_EXPERIMENTS:
      return Object.assign({}, state, {
        isFetching: true,
        samples: [],
        total: null,
      });
    case RECEIVE_EXPERIMENTS:
      return Object.assign({}, state, {
        isFetching: false,
        samples: action.data.results,
        total: action.data.summary.hits,
      });
    default:
      return state;
  }
}

// Action creators

function requestExperiments() {
  return {
    type: REQUEST_EXPERIMENTS,
  };
}

function receiveExperiments(
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
    return fetchJson(`${BASE_URL}/experiments/search?${params}`)
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
