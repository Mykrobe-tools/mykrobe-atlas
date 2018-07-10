/* @flow */

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';

const module = createEntityModule('experiment', {
  typePrefix: 'experiments/experimentMetadata/',
  getState: state => state.experiments.experimentMetadata,
  initialData: {
    location: 'GB',
    labId: '',
    date: '',
    responsiblePersonId: '',
    responsiblePersonData: '',
    patientId: '',
    sampleId: '',
    sequencingMachine: '',
    patientHistory: '',
    sampleType: '',
    susceptibility: {},
    hivPositive: '',
    treatedForTB: '',
    shareSequence: true,
  },
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
