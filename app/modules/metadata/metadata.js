/* @flow */

import { createSelector } from 'reselect';

import { fetchJson } from '../api';
import { showNotification, NotificationCategories } from '../notifications';
import { BASE_URL } from '../../constants/APIConstants.js';

export const typePrefix = 'metadata/metadata/';
export const SET_METADATA = `${typePrefix}SET_METADATA`;
export const POST_METADATA_FORM = `${typePrefix}POST_METADATA_FORM`;

// Selectors

export const getState = state => state.metadata.metadata;
export const getMetadata = createSelector(
  getState,
  metadata => metadata.metadata
);

// Reducer

export const initialState = {
  metadata: {
    location: 'GB',
    labId: '',
    date: '',
    responsiblePersonId: '',
    responsiblePersonData: '',
    patientId: '',
    sampleId: '',
    sequencingMachine: '',
    patientHistory: '',
    sampleType: '',
    susceptibility: {},
    hivPositive: '',
    treatedForTB: '',
    shareSequence: true,
  },
};

export default function reducer(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case POST_METADATA_FORM:
      return {
        ...state,
        metadata: initialState.metadata,
      };
    case SET_METADATA:
      return {
        ...state,
        metadata: action.metadata,
      };
    default:
      return state;
  }
}

// Action creators

export function setMetadata(metadata: Object) {
  return {
    type: SET_METADATA,
    metadata,
  };
}

// Side effects

// TODO: this needs full lifecycle fetch, success, failure

export function postMetadataForm(id: string, metadata: Object) {
  return (dispatch: Function) => {
    dispatch({
      type: POST_METADATA_FORM,
    });
    return dispatch(
      fetchJson(`${BASE_URL}/experiments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(metadata),
      })
    )
      .then(() => {
        dispatch(
          showNotification({
            category: NotificationCategories.SUCCESS,
            content: 'Metadata saved',
          })
        );
      })
      .catch(error => {
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: error.statusText,
            autoHide: false,
          })
        );
      });
  };
}
