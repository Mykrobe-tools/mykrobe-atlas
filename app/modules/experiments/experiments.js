/* @flow */

import { createCollectionModule } from 'makeandship-js-common/src/modules/generic';

import { getExperimentsFiltersSaga } from './experimentsFilters';

const module = createCollectionModule('experiments', {
  typePrefix: 'experiments/experiments/',
  getState: state => state.experiments.experiments,
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
  getError,
  getIsFetching,
  collectionSaga as experimentsSaga,
};

export default reducer;
