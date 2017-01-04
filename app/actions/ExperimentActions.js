/* @flow */

import fetch from 'isomorphic-fetch';
import { BASE_URL } from '../constants/APIConstants';
import * as ActionTypes from '../constants/ActionTypes';

function requestExperiments(filters: Object) {
  return {
    type: ActionTypes.REQUEST_EXPERIMENTS,
    filters
  };
}

function receiveExperiments(data: Array<Object>) {
  return {
    type: ActionTypes.RECEIVE_EXPERIMENTS,
    data
  };
}

export function fetchExperiments(filters: Object = {}) {
  return (dispatch: Function) => {
    dispatch(requestExperiments(filters));
    return fetch(`${BASE_URL}/api/experiments`)
      .then(response => {
        if (response.ok) {
          return response.json().then((data) => {
            dispatch(receiveExperiments(data));
          });
        }
        else {
          return Promise.reject(response.statusText);
        }
      });
  };
}
