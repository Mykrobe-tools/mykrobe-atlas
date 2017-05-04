/* @flow */

import fetch from 'isomorphic-fetch';

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
  console.log('fetch options', options);
  return fetch(url, options);
};
