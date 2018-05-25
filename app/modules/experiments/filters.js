/* @flow */

import { createSelector } from 'reselect';

import { FETCH_JSON } from '../api';
import { API_URL } from '../../constants/APIConstants.js';

export const typePrefix = 'experiments/filters/';
export const REQUEST_FILTER_VALUES = `${typePrefix}REQUEST_FILTER_VALUES`;
export const REQUEST_FILTER_VALUES_SUCCESS = `${typePrefix}REQUEST_FILTER_VALUES_SUCCESS`;
export const REQUEST_FILTER_VALUES_FAILURE = `${typePrefix}REQUEST_FILTER_VALUES_FAILURE`;

// Selectors

export const getState = state => state.experiments.filters;
export const getIsFetching = createSelector(
  getState,
  filters => filters.isFetching
);
export const getFilterValues = createSelector(getState, filters =>
  transformFilterValues(filters.filters)
);

function transformFilterValues(data: Array<string> = []) {
  return data.map(option => {
    return {
      value: option,
      label: option,
    };
  });
}

// Reducer

export const initialState = {
  isFetching: false,
  filters: [],
};

export default function reducer(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case REQUEST_FILTER_VALUES:
      return {
        ...state,
        isFetching: true,
      };
    case REQUEST_FILTER_VALUES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        filters: action.payload,
      };
    case REQUEST_FILTER_VALUES_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
}

// Action creators

// Side effects

export function requestFilterValues(filter: string = '') {
  return async (dispatch: Function) => {
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${API_URL}/experiments/metadata/${filter}/values`,
        types: [
          REQUEST_FILTER_VALUES,
          REQUEST_FILTER_VALUES_SUCCESS,
          REQUEST_FILTER_VALUES_FAILURE,
        ],
      },
    });
    return payload;
  };
}
