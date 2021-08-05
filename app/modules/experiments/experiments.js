/* @flow */

import { createSelector } from 'reselect';
import _get from 'lodash.get';
import qs from 'qs';
import { call } from 'redux-saga/effects';

import { createCollectionModule } from 'makeandship-js-common/src/modules/generic';

import { getExperimentsFiltersSaga } from './experimentsFilters';
import { descriptionForBigsi } from './util/bigsi';
import { getExperimentsTreeNewick } from './experimentsTree';
import {
  filterExperimentsInTree,
  filterExperimentsWithGeolocation,
} from './util/experiments';

export const getState = (state: any) => state.experiments.experiments;

export const getStatus = createSelector(getState, (state) =>
  _get(state, 'data.status')
);

export const getResults = createSelector(getState, (state) =>
  _get(state, 'data.results')
);

export const getIsPending = createSelector(
  getStatus,
  (status) => status === 'pending'
);

export const getSearchId = createSelector(getState, (state) =>
  _get(state, 'data.id')
);

export const getBigsi = createSelector(getState, (state) =>
  _get(state, 'data.bigsi')
);

export const getSearchQuery = createSelector(getState, (state) =>
  _get(state, 'data.search.q')
);

export const getSearchDescription = createSelector(
  getSearchQuery,
  (bigsi, searchQuery) =>
    bigsi
      ? descriptionForBigsi(bigsi)
      : searchQuery
      ? `Search for "${searchQuery}"`
      : 'Search'
);

// FIXME: here we are constructing an explicit query URL to bypass swagger-client
// this is so we can query foo.bar[min]=&foo.bar[max]=
// which are currently otherwise omitted as they cannot be expressed by Swagger 2 spec.

const module = createCollectionModule('experiments', {
  typePrefix: 'experiments/experiments/',
  getState,
  // operationId: 'experimentsSearch',
  url: function* () {
    const filters = yield call(getExperimentsFiltersSaga);
    const query = qs.stringify(filters);
    const url = `/experiments/search?${query}`;
    return yield url;
  },
  parameters: getExperimentsFiltersSaga,
  initialData: { results: [] },
});

const {
  reducer,
  actionTypes: experimentsActionTypes,
  actions: { requestCollection: requestExperiments },
  selectors: {
    getCollection: getExperiments,
    getError: getExperimentsError,
    getIsFetching: getIsFetchingExperiments,
  },
  sagas: { collectionSaga: experimentsSaga },
} = module;

// highlighted with and without tree node

export const getExperimentsInTree = createSelector(
  getExperimentsTreeNewick,
  getResults,
  (newick, experiments) => filterExperimentsInTree(newick, experiments, true)
);

export const getExperimentsNotInTree = createSelector(
  getExperimentsTreeNewick,
  getResults,
  (newick, experiments) => filterExperimentsInTree(newick, experiments, false)
);

// highlighted with and without geolocation available

export const getExperimentsWithGeolocation = createSelector(
  getResults,
  (experiments) => filterExperimentsWithGeolocation(experiments, true)
);

export const getExperimentsWithoutGeolocation = createSelector(
  getResults,
  (experiments) => filterExperimentsWithGeolocation(experiments, false)
);

export {
  experimentsActionTypes,
  requestExperiments,
  getExperiments,
  getExperimentsError,
  getIsFetchingExperiments,
  experimentsSaga,
  getStatus as getExperimentsStatus,
  getIsPending as getExperimentsIsPending,
  getSearchDescription as getExperimentsSearchDescription,
  getSearchQuery as getExperimentsSearchQuery,
};

export default reducer;
