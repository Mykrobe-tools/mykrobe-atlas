/* @flow */

import { createCollectionModule } from 'makeandship-js-common/src/modules/generic';

const module = createCollectionModule('experiments', {
  typePrefix: 'experiments/experiments/',
  getState: state => state.experiments.experiments,
  operationId: 'experimentsList',
  initialData: [],
});

const {
  reducer,
  actionType,
  actions: { requestCollection },
  selectors: { getCollection, getError, getIsFetching },
  sagas: { collectionSaga },
} = module;

export {
  actionType as experimentsActionType,
  requestCollection as requestExperiments,
  getCollection as getExperiments,
  getError,
  getIsFetching,
  collectionSaga as experimentsSaga,
};

export default reducer;
