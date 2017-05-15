/* @flow */

import fetchJson from '../api/fetchJson';
import { BASE_URL } from '../constants/APIConstants';
import * as ActionTypes from '../constants/ActionTypes';
import * as NotificationCategories from '../constants/NotificationCategories';
import {showNotification} from './NotificationActions';
import * as StringHelpers from '../helpers/StringHelpers';

function requestExperiments() {
  return {
    type: ActionTypes.REQUEST_EXPERIMENTS
  };
}

function receiveExperiments(data: Array<Object> = []) {
  return {
    type: ActionTypes.RECEIVE_EXPERIMENTS,
    data
  };
}

function requestFilterValues(filter: string) {
  return {
    type: ActionTypes.REQUEST_FILTER_VALUES,
    filter
  };
}

function receiveFilterValues(data: Array<Object> = []) {
  return {
    type: ActionTypes.RECEIVE_FILTER_VALUES,
    data
  };
}

export function fetchExperiments(filters: Object = {}) {
  return (dispatch: Function) => {
    dispatch(requestExperiments());
    const params = StringHelpers.objectToParamString(filters);
    return fetchJson(`${BASE_URL}/experiments/search?${params}`)
      .then((data) => {
        setTimeout(() => {
          dispatch(receiveExperiments(data));
          return Promise.resolve(data);
        }, 3000);
      })
      .catch((error) => {
        const {statusText} = error;
        dispatch(showNotification({
          category: NotificationCategories.ERROR,
          content: statusText,
          autoHide: false
        }));
        dispatch(receiveExperiments());
        return Promise.reject(error);
      });
  };
}

export function fetchFilterValues(filter: string = '') {
  return (dispatch: Function) => {
    dispatch(requestFilterValues(filter));
    return fetchJson(`${BASE_URL}/experiments/metadata/${filter}/values`)
      .then((data) => {
        const options = transformFilterValues(data);
        dispatch(receiveFilterValues(options));
        return Promise.resolve(options);
      })
      .catch((error) => {
        const {statusText} = error;
        dispatch(showNotification({
          category: NotificationCategories.ERROR,
          content: statusText,
          autoHide: false
        }));
        dispatch(receiveFilterValues());
        return Promise.reject(error);
      });
  };
}

function transformFilterValues(data: Array<string> = []) {
  return data.map(option => {
    return {
      'value': option,
      'label': option
    };
  });
}
