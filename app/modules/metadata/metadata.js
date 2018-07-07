/* @flow */

import { createSelector } from 'reselect';

import { FETCH_JSON } from '../api';
import { showNotification } from 'makeandship-js-common/src/modules/notifications';
import { API_URL } from '../../constants/APIConstants.js';

export const typePrefix = 'metadata/metadata/';
export const SET_METADATA = `${typePrefix}SET_METADATA`;

export const UPDATE_METADATA = `${typePrefix}UPDATE_METADATA`;
export const UPDATE_METADATA_SUCCESS = `${typePrefix}UPDATE_METADATA_SUCCESS`;
export const UPDATE_METADATA_FAILURE = `${typePrefix}UPDATE_METADATA_FAILURE`;

// Selectors

export const getState = state => state.metadata.metadata;
export const getMetadata = createSelector(
  getState,
  metadata => metadata.metadata
);
export const getIsFetching = createSelector(
  getState,
  metadata => metadata.isFetching
);

// Reducer

export const initialState = {
  isFetching: false,
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
    case UPDATE_METADATA:
      return {
        ...state,
        isFetching: true,
      };
    case UPDATE_METADATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        metadata: {
          ...initialState.metadata,
          ...action.payload,
        },
      };
    case UPDATE_METADATA_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    case SET_METADATA:
      return {
        ...state,
        metadata: action.payload,
      };
    default:
      return state;
  }
}

// Action creators

export function setMetadata(metadata: Object) {
  return {
    type: SET_METADATA,
    payload: metadata,
  };
}

// Side effects

export function updateMetadata(id: string, metadata: Object) {
  return async (dispatch: Function) => {
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${API_URL}/experiments/${id}`,
        options: {
          method: 'PUT',
          body: JSON.stringify(metadata),
        },
        types: [
          UPDATE_METADATA,
          UPDATE_METADATA_SUCCESS,
          UPDATE_METADATA_FAILURE,
        ],
      },
    });
    dispatch(showNotification('Metadata saved'));
    return payload;
  };
}
