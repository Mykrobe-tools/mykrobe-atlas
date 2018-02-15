/* @flow */

import { createSelector } from 'reselect';

import fetchJson from '../../api/fetchJson';
import { showNotification, NotificationCategories } from '../notifications';
import { BASE_URL } from '../../constants/APIConstants.js';

export const typePrefix = 'experiments/filters/';
export const REQUEST_FILTER_VALUES = `${typePrefix}REQUEST_FILTER_VALUES`;
export const RECEIVE_FILTER_VALUES = `${typePrefix}RECEIVE_FILTER_VALUES`;

// Selectors

export const getState = state => state.experiments.filters;
export const getIsFetching = createSelector(
  getState,
  filters => filters.isFetching
);
export const getFilterValues = createSelector(
  getState,
  filters => filters.filterValues
);

// Recuder

const initialState = {
  isFetching: false,
  filterValues: [],
};

export default function reducer(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case REQUEST_FILTER_VALUES:
      return Object.assign({}, state, {
        filterValues: [],
      });
    case RECEIVE_FILTER_VALUES:
      return Object.assign({}, state, {
        filterValues: action.data,
      });
    default:
      return state;
  }
}

// Action creators

function requestFilterValues(filter: string) {
  return {
    type: REQUEST_FILTER_VALUES,
    filter,
  };
}

function receiveFilterValues(data: Array<Object> = []) {
  return {
    type: RECEIVE_FILTER_VALUES,
    data,
  };
}

// Side effects

export function fetchFilterValues(filter: string = '') {
  return (dispatch: Function) => {
    dispatch(requestFilterValues(filter));
    return fetchJson(`${BASE_URL}/experiments/metadata/${filter}/values`)
      .then(data => {
        const options = transformFilterValues(data);
        dispatch(receiveFilterValues(options));
        return Promise.resolve(options);
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
        dispatch(receiveFilterValues());
        return Promise.reject(error);
      });
  };
}

function transformFilterValues(data: Array<string> = []) {
  return data.map(option => {
    return {
      value: option,
      label: option,
    };
  });
}
