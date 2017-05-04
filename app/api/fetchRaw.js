/* @flow */

import fetch from 'isomorphic-fetch';
import type { UserType } from '../types/UserTypes';

import store from '../store/store';

/**
 * Adds Authorization token
 */

export default (url: string, options: any = {}): Promise<any> => {
  if (!options.headers) {
    options.headers = {};
  }
  options.headers = {
    ...options.headers,
    'Accept': 'application/json'
  };
  const user: UserType = store.getState().auth.user;
  if (user && user.token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${user.token}`
    };
  }
  console.log('fetch options', options);
  return fetch(url, options);
};
