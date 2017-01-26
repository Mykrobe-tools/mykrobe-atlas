/* @flow */

import fetch from 'isomorphic-fetch';
import { BASE_URL } from '../constants/APIConstants';
import * as ActionTypes from '../constants/ActionTypes';
import * as NotificationCategories from '../constants/NotificationCategories';
import {showNotification} from './NotificationActions';

export function postMetadataForm(metadata: Object) {
  return (dispatch: Function) => {
    return fetch(`${BASE_URL}/api/experiments/1`, {
      method: 'put',
      body: JSON.stringify(metadata)
    })
      .then(response => {
        if (response.ok) {
          return response.json().then((data) => {
            setTimeout(() => {
              dispatch({
                type: ActionTypes.POST_METADATA_FORM
              });
              dispatch(showNotification({
                category: NotificationCategories.MESSAGE,
                content: 'Metadata saved'
              }));
            }, 1000);
          });
        }
        else {
          dispatch(showNotification({
            category: NotificationCategories.ERROR,
            content: response.statusText,
            autoHide: false
          }));
        }
      })
      .catch((err) => {
        dispatch(showNotification({
          category: NotificationCategories.ERROR,
          content: err,
          autoHide: false
        }));
      });
  };
}

export function setMetadata(metadata: Object) {
  return {
    type: ActionTypes.SET_METADATA,
    metadata
  };
}
