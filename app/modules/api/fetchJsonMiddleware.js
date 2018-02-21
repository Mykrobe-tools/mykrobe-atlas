/* @flow */

import 'isomorphic-fetch';

import type { JSendType } from '../../types/JSendType';

// TODO: make token access more generic
import {
  getAuthToken,
  signOut,
  AUTH_SIGNOUT,
  AUTH_SIGNOUT_SUCCESS,
} from '../auth/auth';

import {
  showNotification,
  NotificationCategories,
} from '../notifications/notifications';

import { fetchToCurl } from './fetchToCurl';

export const FETCH_JSON = '@@fetch-json-middleware/FETCH_JSON';

export class FetchJsonError extends Error {
  constructor(status, statusText, response) {
    super();
    this.name = 'FetchJsonError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
    this.message = `${status} - ${statusText}`;
  }
}

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

export const fetchJsonMiddleware = store => next => action => {
  // Do not process actions without [FETCH_JSON] property
  if (!isFetchJson(action)) {
    return next(action);
  }

  const fetchJsonParameters = action[FETCH_JSON];

  const { url, options = {}, types, debug = false } = fetchJsonParameters;

  const [REQUEST, SUCCESS, FAILURE] = normalizeTypes(types);

  next(REQUEST);

  const state = store.getState();
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

  if (debug) {
    console.log(`fetch ${url} options`, options);
    const curl = fetchToCurl(url, options);
    console.log(curl);
  }

  return (async () => {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        if (token && response.status === 401) {
          await store.dispatch(signOut());
        }
        throw new FetchJsonError(
          response.status,
          response.statusText,
          response
        );
      }

      let jsend: JSendType;

      try {
        jsend = await response.json();
      } catch (error) {
        throw new FetchJsonError(response.status, error.message, response);
      }

      const { status, message, data } = jsend;

      if (!status) {
        const json = JSON.stringify(jsend, null, 2);
        throw new FetchJsonError(
          response.status,
          `Invalid JSend response - ${json}`,
          response
        );
      }

      if (status !== 'success') {
        throw new FetchJsonError(response.status, message || data, response);
      }

      if (debug) {
        console.log('data', JSON.stringify(data, null, 2));
      }

      next({ ...SUCCESS, payload: data });
      return data;
    } catch (error) {
      next(FAILURE);
      const content = error.message || error.statusText;
      await store.dispatch(
        showNotification({
          category: NotificationCategories.ERROR,
          content,
        })
      );
      throw error;
    }
  })();
};
