/* @flow */

import type { JSendType } from '../../types/JSendType';

import {
  getAccessToken,
  signOut,
} from 'makeandship-js-common/src/modules/auth';
import {
  showNotification,
  NotificationCategories,
} from 'makeandship-js-common/src/modules/notifications';

import { fetchToCurl } from './fetchToCurl';

/**
 * Request and parse a JSend resource from the API
 * Adds Authorization token if stored in cookie
 * Resolves with json object or rejects with JSend or request error
 * Uses dispatch to send action for any unauthorized request
 * @param  {dispatch} Function
 * @param  {string} url
 * @param  {any={}} options
 * @returns Promise
 */

export function fetchJson(url: string, options: any = {}) {
  return (dispatch: Function, getState: Function) => {
    const state = getState();
    const token = getAccessToken(state);
    return fetchJsonWithTokenAndDispatch(url, options, token, dispatch);
  };
}

// TODO: this is a workaround for services which currently do not have redux integration

export function fetchJsonWithToken(
  url: string,
  options: any = {},
  token?: string
) {
  return fetchJsonWithTokenAndDispatch(url, options, token);
}

function fetchJsonWithTokenAndDispatch(
  url: string,
  options: any = {},
  token?: string,
  dispatch?: Function
) {
  if (!options.headers) {
    options.headers = {};
  }
  options.headers = {
    ...options.headers,
    Accept: 'application/json',
  };
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  console.log(`fetch ${url} options`, options);
  const curl = fetchToCurl(url, options);
  console.log(curl);
  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json().then((jsend: JSendType) => {
          const { status, message, data } = jsend;
          if (!status) {
            const json = JSON.stringify(jsend, null, 2);
            return Promise.reject({
              status: response.status,
              statusText: `Invalid JSend response ${json}`,
            });
          } else if (status === 'success') {
            console.log('data', JSON.stringify(data, null, 2));
            return Promise.resolve(data);
          }
          return Promise.reject({
            status: response.status,
            statusText: message || data,
          });
        });
      } else {
        if (token && response.status === 401) {
          dispatch && dispatch(signOut());
        }
        return Promise.reject({
          status: response.status,
          statusText: response.statusText,
        });
      }
    })
    .catch(error => {
      dispatch &&
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: error.statusText || error.message,
          })
        );
      // An error we generated
      if (error.statusText) {
        return Promise.reject(error);
      }
      // An error from underlying network, e.g. failed preflight check
      return Promise.reject({
        statusText: error.message,
      });
    });
}
