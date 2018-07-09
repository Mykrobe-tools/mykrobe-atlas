/* @flow */

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';

const module = createEntityModule('experiment', {
  typePrefix: 'experiments/experimentFile/',
  getState: state => state.experiments.experimentFile,
  initialData: {},
  update: {
    operationId: 'experimentDownloadFile',
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
  updateEntity as updateExperimentFile,
  getEntity as getExperimentFile,
  getError,
  getIsFetching,
  entitySaga as experimentFileSaga,
  actionType as experimentFileActionType,
};

export default reducer;
