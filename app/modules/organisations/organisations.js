/* @flow */

// TODO: split and separate all organisations vs single
// organisations
// organisation

import { createSelector } from 'reselect';
import { push } from 'react-router-redux';

import fetchJson from '../../api/fetchJson';
import { showNotification, NotificationCategories } from '../notifications';
import { BASE_URL } from '../../constants/APIConstants.js';
import type { OrganisationType } from '../../types/OrganisationTypes';

export const typePrefix = 'organisations/organisations/';
export const REQUEST_ALL_ORGANISATIONS = `${typePrefix}REQUEST_ALL_ORGANISATIONS`;
export const REQUEST_ALL_ORGANISATIONS_SUCCESS = `${typePrefix}REQUEST_ALL_ORGANISATIONS_SUCCESS`;
export const REQUEST_ALL_ORGANISATIONS_FAIL = `${typePrefix}REQUEST_ALL_ORGANISATIONS_FAIL`;

export const NEW_ORGANISATION = `${typePrefix}NEW_ORGANISATION`;

export const CREATE_ORGANISATION = `${typePrefix}CREATE_ORGANISATION`;
export const CREATE_ORGANISATION_SUCCESS = `${typePrefix}CREATE_ORGANISATION_SUCCESS`;
export const CREATE_ORGANISATION_FAIL = `${typePrefix}CREATE_ORGANISATION_FAIL`;

export const REQUEST_ORGANISATION = `${typePrefix}REQUEST_ORGANISATION`;
export const REQUEST_ORGANISATION_SUCCESS = `${typePrefix}REQUEST_ORGANISATION_SUCCESS`;
export const REQUEST_ORGANISATION_FAIL = `${typePrefix}REQUEST_ORGANISATION_FAIL`;

export const UPDATE_ORGANISATION = `${typePrefix}UPDATE_ORGANISATION`;
export const UPDATE_ORGANISATION_SUCCESS = `${typePrefix}UPDATE_ORGANISATION_SUCCESS`;
export const UPDATE_ORGANISATION_FAIL = `${typePrefix}UPDATE_ORGANISATION_FAIL`;

export const DELETE_ORGANISATION = `${typePrefix}DELETE_ORGANISATION`;
export const DELETE_ORGANISATION_SUCCESS = `${typePrefix}DELETE_ORGANISATION_SUCCESS`;
export const DELETE_ORGANISATION_FAIL = `${typePrefix}DELETE_ORGANISATION_FAIL`;

export const ORGANISATION_UPDATE_FAILURE_REASON = `${typePrefix}ORGANISATION_UPDATE_FAILURE_REASON`;
export const ORGANISATION_DELETE_FAILURE_REASON = `${typePrefix}ORGANISATION_DELETE_FAILURE_REASON`;

// Selectors

export const getState = state => state.organisations.organisations;
export const getIsFetching = createSelector(
  getState,
  organisations => organisations.isFetching
);
export const getIsSaving = createSelector(
  getState,
  organisations => organisations.isSaving
);
export const getData = createSelector(
  getState,
  organisations => organisations.data
);
export const getDataById = createSelector(getData, data => {
  let dataById = {};
  data.map(item => {
    dataById[item.id] = item;
  });
  return dataById;
});

// Reducer

const initialState = {
  isFetching: false,
  isSaving: false,
  data: {},
};

export default function reducer(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case REQUEST_ALL_ORGANISATIONS:
      return {
        ...state,
        isFetching: true,
      };
    case REQUEST_ALL_ORGANISATIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          allOrganisations: action.data,
        },
      };
    case REQUEST_ORGANISATION:
      return {
        ...state,
        isFetching: true,
        data: {
          ...state.data,
          organisation: undefined,
        },
      };
    case REQUEST_ORGANISATION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          organisation: action.data,
        },
      };
    case CREATE_ORGANISATION_SUCCESS:
      return {
        ...state,
        isSaving: false,
        data: {
          ...state.data,
          organisation: action.data,
        },
      };
    case UPDATE_ORGANISATION_SUCCESS:
      return {
        ...state,
        isSaving: false,
        data: {
          ...state.data,
          organisation: action.data,
        },
      };
    //
    //
    //
    case NEW_ORGANISATION:
      return {
        ...state,
        data: {
          ...state.data,
          organisation: {},
        },
      };
    case CREATE_ORGANISATION:
      return {
        ...state,
        isSaving: true,
      };
    case UPDATE_ORGANISATION:
      return {
        ...state,
        isSaving: true,
      };
    case ORGANISATION_UPDATE_FAILURE_REASON:
      return {
        ...state,
        failureReason: action.failureReason,
      };
    case ORGANISATION_DELETE_FAILURE_REASON:
      return {
        ...state,
        failureReason: undefined,
      };
    default:
      return state;
  }
}

// Action creators

export function updateFailureReason(failureReason: string) {
  return (dispatch: Function) => {
    dispatch({
      type: ORGANISATION_UPDATE_FAILURE_REASON,
      failureReason,
    });
  };
}

export function deleteFailureReason() {
  return (dispatch: Function) => {
    dispatch({
      type: ORGANISATION_DELETE_FAILURE_REASON,
    });
  };
}

// Side effects

export function requestAllOrganisations() {
  return (dispatch: Function) => {
    dispatch({
      type: REQUEST_ALL_ORGANISATIONS,
    });
    return fetchJson(`${BASE_URL}/organisations`)
      .then(data => {
        dispatch({
          type: REQUEST_ALL_ORGANISATIONS_SUCCESS,
          data,
        });
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: REQUEST_ALL_ORGANISATIONS_FAIL,
          error,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: statusText,
          })
        );
        return Promise.reject(error);
      });
  };
}

export function requestOrganisation(id: string) {
  return (dispatch: Function) => {
    dispatch({
      type: REQUEST_ORGANISATION,
      id,
    });
    return fetchJson(`${BASE_URL}/organisations/${id}`)
      .then(data => {
        dispatch({
          type: REQUEST_ORGANISATION_SUCCESS,
          data,
        });
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: REQUEST_ORGANISATION_FAIL,
          error,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: statusText,
          })
        );
        return Promise.reject(error);
      });
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
  return (dispatch: Function) => {
    dispatch({
      type: CREATE_ORGANISATION,
    });
    return fetchJson(`${BASE_URL}/organisations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(organisation),
    })
      .then(data => {
        dispatch({
          type: CREATE_ORGANISATION_SUCCESS,
          data,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.SUCCESS,
            content: `Organisation "${data.name}" created`,
          })
        );
        dispatch(push('/organisation/'));
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: CREATE_ORGANISATION_FAIL,
          statusText,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: statusText,
          })
        );
        return Promise.reject(error);
      });
  };
}

export function updateOrganisation(organisation: OrganisationType) {
  return (dispatch: Function) => {
    dispatch({
      type: UPDATE_ORGANISATION,
    });
    if (!organisation.id) {
      throw new Error('Missing organisation id');
    }
    return fetchJson(`${BASE_URL}/organisations/${organisation.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(organisation),
    })
      .then((data: OrganisationType) => {
        dispatch({
          type: UPDATE_ORGANISATION_SUCCESS,
          data,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.SUCCESS,
            content: 'Organisation updated',
          })
        );
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: UPDATE_ORGANISATION_FAIL,
          statusText,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: statusText,
          })
        );
        return Promise.reject(error);
      });
  };
}

export function deleteOrganisation(organisation: OrganisationType) {
  return (dispatch: Function) => {
    dispatch({
      type: DELETE_ORGANISATION,
    });
    if (!organisation.id) {
      throw new Error('Missing organisation id');
    }
    return fetchJson(`${BASE_URL}/organisations/${organisation.id}`, {
      method: 'DELETE',
    })
      .then((data: OrganisationType) => {
        dispatch({
          type: DELETE_ORGANISATION_SUCCESS,
          organisation: data,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.SUCCESS,
            content: 'Organisation deleted',
          })
        );
        dispatch(push('/organisation'));
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: DELETE_ORGANISATION_FAIL,
          statusText,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: statusText,
          })
        );
        return Promise.reject(error);
      });
  };
}
