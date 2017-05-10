/* @flow */

import fetchJson from '../api/fetchJson';
import type { OrganisationType } from '../types/OrganisationTypes';
import * as NotificationCategories from '../constants/NotificationCategories';
import {showNotification} from './NotificationActions';
import { BASE_URL } from '../constants/APIConstants.js';
import * as ActionTypes from '../constants/ActionTypes';
import { push } from 'react-router-redux';

export function requestAllOrganisations() {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.REQUEST_ALL_ORGANISATIONS
    });
    return fetchJson(`${BASE_URL}/organisations`)
    .then((data) => {
      dispatch({
        type: ActionTypes.REQUEST_ALL_ORGANISATIONS_SUCCESS,
        data
      });
      return Promise.resolve(data);
    })
    .catch((error) => {
      const {statusText} = error;
      dispatch({
        type: ActionTypes.REQUEST_ALL_ORGANISATIONS_FAIL,
        error
      });
      dispatch(showNotification({
        category: NotificationCategories.ERROR,
        content: statusText
      }));
      return Promise.reject(error);
    });
  };
}

export function requestOrganisation(id: string) {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.REQUEST_ORGANISATION,
      id
    });
    return fetchJson(`${BASE_URL}/organisations/${id}`)
      .then((data) => {
        dispatch({
          type: ActionTypes.REQUEST_ORGANISATION_SUCCESS,
          data
        });
        return Promise.resolve(data);
      })
      .catch((error) => {
        const {statusText} = error;
        dispatch({
          type: ActionTypes.REQUEST_ORGANISATION_FAIL,
          error
        });
        dispatch(showNotification({
          category: NotificationCategories.ERROR,
          content: statusText
        }));
        return Promise.reject(error);
      });
  };
}

export function createOrUpdateOrganisation(organisation: OrganisationType) {
  return organisation.id ? updateOrganisation(organisation) : createOrganisation(organisation);
}

//
// Add
//

export function createOrganisation(organisation: OrganisationType) {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.CREATE_ORGANISATION
    });
    return fetchJson(`${BASE_URL}/organisations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(organisation)
    })
    .then((data) => {
      dispatch({
        type: ActionTypes.CREATE_ORGANISATION_SUCCESS,
        data
      });
      dispatch(showNotification({
        category: NotificationCategories.SUCCESS,
        content: `Organisation "${data.name}" created`
      }));
      dispatch(push('/organisation/'));
      return Promise.resolve(data);
    })
    .catch((error) => {
      const {statusText} = error;
      dispatch({
        type: ActionTypes.CREATE_ORGANISATION_FAIL,
        statusText
      });
      dispatch(showNotification({
        category: NotificationCategories.ERROR,
        content: statusText
      }));
      return Promise.reject(error);
    });
  };
}

export function updateOrganisation(organisation: OrganisationType) {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.UPDATE_ORGANISATION
    });
    if (!organisation.id) {
      throw new Error('Missing organisation id');
    }
    return fetchJson(`${BASE_URL}/organisations/${organisation.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(organisation)
    })
    .then((data: OrganisationType) => {
      dispatch({
        type: ActionTypes.UPDATE_ORGANISATION_SUCCESS,
        data
      });
      dispatch(showNotification({
        category: NotificationCategories.SUCCESS,
        content: 'Organisation updated'
      }));
      return Promise.resolve(data);
    })
    .catch((error) => {
      const {statusText} = error;
      dispatch({
        type: ActionTypes.UPDATE_ORGANISATION_FAIL,
        statusText
      });
      dispatch(showNotification({
        category: NotificationCategories.ERROR,
        content: statusText
      }));
      return Promise.reject(error);
    });
  };
}

export function deleteOrganisation(organisation: OrganisationType) {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.DELETE_ORGANISATION
    });
    if (!organisation.id) {
      throw new Error('Missing organisation id');
    }
    return fetchJson(`${BASE_URL}/organisations/${organisation.id}`, {
      method: 'DELETE'
    })
    .then((data: OrganisationType) => {
      dispatch({
        type: ActionTypes.DELETE_ORGANISATION_SUCCESS,
        organisation: data
      });
      dispatch(showNotification({
        category: NotificationCategories.SUCCESS,
        content: 'Organisation deleted'
      }));
      dispatch(push('/organisation'));
      return Promise.resolve(data);
    })
    .catch((error) => {
      const {statusText} = error;
      dispatch({
        type: ActionTypes.DELETE_ORGANISATION_FAIL,
        statusText
      });
      dispatch(showNotification({
        category: NotificationCategories.ERROR,
        content: statusText
      }));
      return Promise.reject(error);
    });
  };
}

//
// Failure reason
//

export function updateFailureReason(failureReason: string) {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.ORGANISATION_UPDATE_FAILURE_REASON,
      failureReason
    });
  };
}

export function deleteFailureReason() {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.ORGANISATION_DELETE_FAILURE_REASON
    });
  };
}
