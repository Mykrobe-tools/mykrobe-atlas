/* @flow */

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';

const module = createEntityModule('experiment', {
  typePrefix: 'experiments/experimentProvider/',
  getState: state => state.experiments.experimentProvider,
  initialData: {},
  update: {
    operationId: 'experimentProviderUpload',
  },
});

const {
  reducer,
  actionType,
  actions: { updateEntity },
  selectors: { getEntity, getError, getIsFetching },
  sagas: { entitySaga },
} = module;

export {
  updateEntity as updateExperimentProvider,
  getEntity as getExperimentProvider,
  getError,
  getIsFetching,
  entitySaga as experimentProviderSaga,
  actionType as experimentProviderActionType,
};

export default reducer;
