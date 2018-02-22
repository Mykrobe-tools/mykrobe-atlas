/* @flow */

import { createSelector } from 'reselect';

import { FETCH_JSON } from '../api';
import { BASE_URL } from '../../constants/APIConstants.js';

export const typePrefix = 'organisations/organisations/';
export const REQUEST_ORGANISATIONS = `${typePrefix}REQUEST_ORGANISATIONS`;
export const REQUEST_ORGANISATIONS_SUCCESS = `${typePrefix}REQUEST_ORGANISATIONS_SUCCESS`;
export const REQUEST_ORGANISATIONS_FAILURE = `${typePrefix}REQUEST_ORGANISATIONS_FAILURE`;

// Selectors

export const getState = state => state.organisations.organisations;
export const getIsFetching = createSelector(
  getState,
  organisations => organisations.isFetching
);
export const getError = createSelector(
  getState,
  organisations => organisations.error
);
export const getOrganisations = createSelector(
  getState,
  organisations => organisations.organisations
);
export const getOrganisationsById = createSelector(getOrganisations, data => {
  let dataById = {};
  data.map(item => {
    dataById[item.id] = item;
  });
  return dataById;
});

// Reducer

export const initialState = {
  isFetching: false,
  organisations: [],
};

export default function reducer(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case REQUEST_ORGANISATIONS:
      return {
        ...state,
        isFetching: true,
        error: undefined,
      };
    case REQUEST_ORGANISATIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        organisations: action.payload,
      };
    case REQUEST_ORGANISATIONS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

// Action creators

// Side effects

export function requestOrganisations() {
  return async (dispatch: Function) => {
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/organisations`,
        types: [
          REQUEST_ORGANISATIONS,
          REQUEST_ORGANISATIONS_SUCCESS,
          REQUEST_ORGANISATIONS_FAILURE,
        ],
      },
    });
    return payload;
  };
}
