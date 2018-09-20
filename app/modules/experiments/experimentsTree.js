/* @flow */

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';

const module = createEntityModule('experimentsTree', {
  typePrefix: 'experiments/experimentsTree/',
  getState: state => state.experiments.experimentsTree,
  request: {
    operationId: 'experimentsTree',
  },
});

const {
  reducer,
  actions: { requestEntity },
  selectors: { getEntity, getError, getIsFetching },
  sagas: { entitySaga },
} = module;

export {
  requestEntity as requestExperimentsTree,
  getEntity as getExperimentsTree,
  getError,
  getIsFetching,
  entitySaga as experimentsTreeSaga,
};

export default reducer;
