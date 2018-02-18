/* @flow */

import 'isomorphic-fetch';

import type { JSendType } from '../../types/JSendType';

import { getAuthToken, signOut } from '../auth';
import {
  showNotification,
  NotificationCategories,
} from '../notifications/notifications';

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
    if (!options.headers) {
      options.headers = {};
    }
    options.headers = {
      ...options.headers,
      Accept: 'application/json',
    };
    const state = getState();
    const token = getAuthToken(state);
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
            dispatch(signOut());
          }
          return Promise.reject({
            status: response.status,
            statusText: response.statusText,
          });
        }
      })
      .catch(error => {
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
  };
}
