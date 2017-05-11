/* @flow */

import fetchJson from '../api/fetchJson';
import { BASE_URL } from '../constants/APIConstants';
import * as ActionTypes from '../constants/ActionTypes';
import * as NotificationCategories from '../constants/NotificationCategories';
import {showNotification} from './NotificationActions';

export function postMetadataForm(id: string, metadata: Object) {
  return (dispatch: Function) => {
    return fetchJson(`${BASE_URL}/experiments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(metadata)
    })
      .then((data) => {
        dispatch({
          type: ActionTypes.POST_METADATA_FORM
        });
        setTimeout(() => {
          dispatch(showNotification({
            category: NotificationCategories.SUCCESS,
            content: 'Metadata saved'
          }));
        }, 1000);
      })
      .catch((error) => {
        dispatch(showNotification({
          category: NotificationCategories.ERROR,
          content: error.statusText,
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

export function fetchTemplate(id: string) {
  return (dispatch: Function) => {
    const testData = require('../../test/_fixtures/api/template.json');
    dispatch({
      type: ActionTypes.SET_METADATA_TEMPLATE,
      template: testData
    });
  };
}
