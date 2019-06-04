/* @flow */

import { createSelector } from 'reselect';
import _get from 'lodash.get';

import { createCollectionModule } from 'makeandship-js-common/src/modules/generic';

import { getExperimentsFiltersSaga } from './experimentsFilters';
import { descriptionForBigsi } from './util/bigsi';
import { getExperimentsTreeNewick } from './experimentsTree';
import {
  experimentsInTree,
  experimentsWithGeolocation,
} from './util/experiments';

export const getState = (state: any) => state.experiments.experiments;

export const getStatus = createSelector(getState, state =>
  _get(state, 'data.status')
);

export const getResults = createSelector(getState, state =>
  _get(state, 'data.results')
);

export const getIsPending = createSelector(
  getStatus,
  status => status === 'pending'
);

export const getBigsi = createSelector(getState, state =>
  _get(state, 'data.bigsi')
);

export const getSearchQuery = createSelector(getState, state =>
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

const module = createCollectionModule('experiments', {
  typePrefix: 'experiments/experiments/',
  getState,
  operationId: 'experimentsSearch',
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
  (newick, experiments) => experimentsInTree(newick, experiments, true)
);

export const getExperimentsNotInTree = createSelector(
  getExperimentsTreeNewick,
  getResults,
  (newick, experiments) => experimentsInTree(newick, experiments, false)
);

// highlighted with and without geolocation available

export const getExperimentsWithGeolocation = createSelector(
  getResults,
  experiments => experimentsWithGeolocation(experiments, true)
);

export const getExperimentsWithoutGeolocation = createSelector(
  getResults,
  experiments => experimentsWithGeolocation(experiments, false)
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
