/* @flow */

import { createSelector } from 'reselect';
import _get from 'lodash.get';

import { createCollectionModule } from 'makeandship-js-common/src/modules/generic';

import { getExperimentsFiltersSaga } from './experimentsFilters';

export const getState = (state: any) => state.experiments.experiments;

export const getStatus = createSelector(getState, state =>
  _get(state, 'data.status')
);

export const getIsPending = createSelector(
  getStatus,
  status => status === 'pending'
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
  actionTypes,
  actions: { requestCollection },
  selectors: { getCollection, getError, getIsFetching },
  sagas: { collectionSaga },
} = module;

export {
  actionTypes as experimentsActionTypes,
  requestCollection as requestExperiments,
  getCollection as getExperiments,
  getError as getExperimentError,
  getIsFetching as getIsFetchingExperiments,
  collectionSaga as experimentsSaga,
  getStatus as getExperimentsStatus,
  getIsPending as getExperimentsIsPending,
};

export default reducer;
