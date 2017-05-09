/* @flow */

import fetchJson from '../api/fetchJson';
import * as NotificationCategories from '../constants/NotificationCategories';
import {showNotification} from './NotificationActions';
import { BASE_URL } from '../constants/APIConstants.js';
import * as ActionTypes from '../constants/ActionTypes';

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
