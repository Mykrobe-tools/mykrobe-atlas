/* @flow */

import fetch from 'isomorphic-fetch';
import type { JSendType } from '../types/JSendType';
import type { UserType } from '../types/UserTypes';
import * as AuthActions from '../actions/AuthActions';

import store from '../store/store';

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

export default (url: string, options: any = {}): Promise<any> => {
  if (!options.headers) {
    options.headers = {};
  }
  options.headers = {
    ...options.headers,
    Accept: 'application/json',
  };
  const user: UserType = store.getState().auth.user;
  if (user && user.token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${user.token}`,
    };
  }
  console.log('fetch options', options);
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
            return Promise.resolve(data);
          }
          return Promise.reject({
            status: response.status,
            statusText: message,
          });
        });
      } else {
        if (response.status === 401) {
          AuthActions.signOut()(store.dispatch);
        }
        return Promise.reject({
          status: response.status,
          statusText: response.statusText,
        });
      }
    })
    .catch(error => {
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
