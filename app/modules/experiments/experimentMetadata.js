/* @flow */

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';

const module = createEntityModule('experiment', {
  typePrefix: 'experiments/experimentMetadata/',
  getState: state => state.experiments.experimentMetadata,
  initialData: {},
  update: {
    operationId: 'experimentUpdateMetadata',
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
  updateEntity as updateExperimentMetadata,
  getEntity as getExperimentMetadata,
  getError,
  getIsFetching,
  entitySaga as experimentMetadataSaga,
  actionType as experimentMetadataActionType,
};

export default reducer;
