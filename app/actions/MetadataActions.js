/* @flow */

import fetchJson from '../api/fetchJson';
import { BASE_URL } from '../constants/APIConstants';
import * as ActionTypes from '../constants/ActionTypes';
import * as NotificationCategories from '../constants/NotificationCategories';
import { showNotification } from './NotificationActions';
import type { UserType } from '../types/UserTypes';

export function postMetadataForm(id: string, metadata: Object) {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.POST_METADATA_FORM,
    });
    return fetchJson(`${BASE_URL}/experiments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(metadata),
    })
      .then(data => {
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

export function setMetadata(metadata: Object) {
  return {
    type: ActionTypes.SET_METADATA,
    metadata,
  };
}

export function fetchTemplate(user: UserType) {
  return (dispatch: Function) => {
    // todo - integrate with API
    const testData = require('../../test/_fixtures/api/template.json');
    const template =
      user.organisation && user.organisation.template
        ? user.organisation.template
        : Object.keys(testData)[0];
    dispatch({
      type: ActionTypes.SET_METADATA_TEMPLATE,
      template: testData[template],
    });
  };
}
