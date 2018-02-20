/* @flow */

import 'isomorphic-fetch';

import type { JSendType } from '../../types/JSendType';

import { getAuthToken, signOut } from '../auth';
import {
  showNotification,
  NotificationCategories,
} from '../notifications/notifications';

import { fetchToCurl } from './fetchToCurl';

export const FETCH_JSON = '@@fetch-json-middleware/FETCH_JSON';

const isFetchJson = action => {
  return action.hasOwnProperty && action.hasOwnProperty(FETCH_JSON);
};

const normalizeTypes = types =>
  types.map(type => {
    if (typeof type === 'string') {
      return {
        type,
      };
    }
    return type;
  });

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

export const fetchJsonMiddleware = ({ getState }) => next => action => {

  // Do not process actions without [FETCH_JSON] property
  if (!isFetchJson(action)) {
    return next(action);
  }

  const fetchJsonParameters = action[FETCH_JSON];

  const { url, options = {}, types } = fetchJsonParameters;

  const [REQUEST, SUCCESS, FAILURE] = normalizeTypes(types);

  const state = getState();
  const token = getAuthToken(state);

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

  console.log('REQUEST', REQUEST);
  next(REQUEST);

  return (async () => {
    // setTimeout(() => {}, 1000);
    await timeout(1000);
    console.log('SUCCESS', SUCCESS);
    return next(SUCCESS);
  })();
};
