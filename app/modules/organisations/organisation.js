/* @flow */

import { createSelector } from 'reselect';

import { FETCH_JSON } from '../api';
import { showNotification } from '../notifications';
import { BASE_URL } from '../../constants/APIConstants.js';
import type { OrganisationType } from '../../types/OrganisationTypes';

export const typePrefix = 'organisations/organisations/';
export const NEW_ORGANISATION = `${typePrefix}NEW_ORGANISATION`;

export const CREATE_ORGANISATION = `${typePrefix}CREATE_ORGANISATION`;
export const CREATE_ORGANISATION_SUCCESS = `${typePrefix}CREATE_ORGANISATION_SUCCESS`;
export const CREATE_ORGANISATION_FAILURE = `${typePrefix}CREATE_ORGANISATION_FAILURE`;

export const REQUEST_ORGANISATION = `${typePrefix}REQUEST_ORGANISATION`;
export const REQUEST_ORGANISATION_SUCCESS = `${typePrefix}REQUEST_ORGANISATION_SUCCESS`;
export const REQUEST_ORGANISATION_FAILURE = `${typePrefix}REQUEST_ORGANISATION_FAILURE`;

export const UPDATE_ORGANISATION = `${typePrefix}UPDATE_ORGANISATION`;
export const UPDATE_ORGANISATION_SUCCESS = `${typePrefix}UPDATE_ORGANISATION_SUCCESS`;
export const UPDATE_ORGANISATION_FAILURE = `${typePrefix}UPDATE_ORGANISATION_FAILURE`;

export const DELETE_ORGANISATION = `${typePrefix}DELETE_ORGANISATION`;
export const DELETE_ORGANISATION_SUCCESS = `${typePrefix}DELETE_ORGANISATION_SUCCESS`;
export const DELETE_ORGANISATION_FAILURE = `${typePrefix}DELETE_ORGANISATION_FAILURE`;

// Selectors

export const getState = state => state.organisations.organisation;
export const getIsFetching = createSelector(
  getState,
  organisation => organisation.isFetching
);
export const getError = createSelector(
  getState,
  organisation => organisation.error
);
export const getOrganisation = createSelector(
  getState,
  organisation => organisation.organisation
);

// Reducer

export const initialState = {
  isFetching: false,
  organisation: {},
};

export default function reducer(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case NEW_ORGANISATION:
      return {
        ...state,
        organisation: {},
        error: undefined,
      };
    case CREATE_ORGANISATION:
    case REQUEST_ORGANISATION:
    case UPDATE_ORGANISATION:
      return {
        ...state,
        isFetching: true,
        error: undefined,
      };
    case CREATE_ORGANISATION_SUCCESS:
    case REQUEST_ORGANISATION_SUCCESS:
    case UPDATE_ORGANISATION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        organisation: action.payload,
      };
    case CREATE_ORGANISATION_FAILURE:
    case REQUEST_ORGANISATION_FAILURE:
    case UPDATE_ORGANISATION_FAILURE:
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

export function requestOrganisation(id: string) {
  return async (dispatch: Function) => {
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/organisations/${id}`,
        types: [
          REQUEST_ORGANISATION,
          REQUEST_ORGANISATION_SUCCESS,
          REQUEST_ORGANISATION_FAILURE,
        ],
      },
    });
    return payload;
  };
}

export function createOrUpdateOrganisation(organisation: OrganisationType) {
  return organisation.id
    ? updateOrganisation(organisation)
    : createOrganisation(organisation);
}

//
// Add
//

export function createOrganisation(organisation: OrganisationType) {
  return async (dispatch: Function) => {
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/organisations`,
        options: {
          method: 'POST',
          body: JSON.stringify(organisation),
        },
        types: [
          CREATE_ORGANISATION,
          CREATE_ORGANISATION_SUCCESS,
          CREATE_ORGANISATION_FAILURE,
        ],
      },
    });
    dispatch(showNotification(`Organisation "${payload.name}" created`));
    return payload;
  };
}

export function updateOrganisation(organisation: OrganisationType) {
  return async (dispatch: Function) => {
    if (!organisation.id) {
      throw new Error('Missing organisation id');
    }
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/organisations/${organisation.id}`,
        options: {
          method: 'PUT',
          body: JSON.stringify(organisation),
        },
        types: [
          UPDATE_ORGANISATION,
          UPDATE_ORGANISATION_SUCCESS,
          UPDATE_ORGANISATION_FAILURE,
        ],
      },
    });
    dispatch(showNotification(`Organisation "${payload.name}" updated`));
    return payload;
  };
}

export function deleteOrganisation(organisation: OrganisationType) {
  return async (dispatch: Function) => {
    if (!organisation.id) {
      throw new Error('Missing organisation id');
    }
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/organisations/${organisation.id}`,
        options: {
          method: 'DELETE',
        },
        types: [
          DELETE_ORGANISATION,
          DELETE_ORGANISATION_SUCCESS,
          DELETE_ORGANISATION_FAILURE,
        ],
      },
    });
    dispatch(showNotification(`Organisation deleted`));
    return payload;
  };
}
