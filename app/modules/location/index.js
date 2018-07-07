/* @flow */

import { select } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import { parseQuery, stringifyQuery } from './util';
import _ from 'lodash';

// Selectors

export const getState = (state: any) => state.routing.location;

export const getQuery = createSelector(getState, location => {
  const query = parseQuery(location.search);
  return query;
});

export const getHasQuery = createSelector(getQuery, query => {
  const keys = Object.keys(query);
  return keys.length !== 0;
});

// Actions

export const setQuery = (query: any, preservePage: boolean = false) => {
  const cleanQuery = _.omitBy(query, _.isNil);
  if (!preservePage) {
    // reset page
    cleanQuery.page && delete cleanQuery.page;
  }
  const search = stringifyQuery(cleanQuery);
  return push({ search });
};

export const clearQuery = () => {
  const search = '';
  return push({ search });
};

// Side effects

// TODO: implement a more robust way to add query to url

export function* addQueryToUrl(url: string): Generator<*, *, *> {
  const query = yield select(getQuery);
  const hasQuery = yield select(getHasQuery);
  if (hasQuery) {
    const search = stringifyQuery(query);
    url += `?${search}`;
  }
  return yield url;
}

export function* getQueryParameters(): Generator<*, *, *> {
  const query = yield select(getQuery);
  return yield query;
}
