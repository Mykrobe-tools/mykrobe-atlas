/* @flow */

import fetchJson from '../api/fetchJson';
import { BASE_URL } from '../constants/APIConstants';
import * as ActionTypes from '../constants/ActionTypes';
import * as NotificationCategories from '../constants/NotificationCategories';
import {showNotification} from './NotificationActions';

function requestExperiments(filters: Object) {
  return {
    type: ActionTypes.REQUEST_EXPERIMENTS,
    filters
  };
}

function receiveExperiments(data: Array<Object> = []) {
  return {
    type: ActionTypes.RECEIVE_EXPERIMENTS,
    data
  };
}

export function fetchExperiments(filters: Object = {}) {
  return (dispatch: Function) => {
    dispatch(requestExperiments(filters));
    return fetchJson(`${BASE_URL}/experiments`)
      .then((data) => {
        setTimeout(() => {
          dispatch(receiveExperiments(data));
        }, 3000);
      })
      .catch((err) => {
        const {statusText} = err;
        dispatch(showNotification({
          category: NotificationCategories.ERROR,
          content: statusText,
          autoHide: false
        }));
        dispatch(receiveExperiments());
      });
  };
}
