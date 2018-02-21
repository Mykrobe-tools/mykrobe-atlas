/* @flow */

import { createSelector } from 'reselect';

import { FETCH_JSON } from '../api';
import { BASE_URL } from '../../constants/APIConstants.js';

export const typePrefix = 'experiments/filters/';
export const FETCH_FILTER_VALUES = `${typePrefix}FETCH_FILTER_VALUES`;
export const FETCH_FILTER_VALUES_SUCCESS = `${typePrefix}FETCH_FILTER_VALUES_SUCCESS`;
export const FETCH_FILTER_VALUES_FAILURE = `${typePrefix}FETCH_FILTER_VALUES_FAILURE`;

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
    case FETCH_FILTER_VALUES:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_FILTER_VALUES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        filters: action.payload,
      };
    case FETCH_FILTER_VALUES_FAILURE:
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

export function fetchFilterValues(filter: string = '') {
  return async (dispatch: Function) => {
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/experiments/metadata/${filter}/values`,
        types: [
          FETCH_FILTER_VALUES,
          FETCH_FILTER_VALUES_SUCCESS,
          FETCH_FILTER_VALUES_FAILURE,
        ],
      },
    });
    return payload;
  };
}
