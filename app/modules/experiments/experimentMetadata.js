/* @flow */

import { select, put } from 'redux-saga/effects';

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';

import { showNotification } from '../notifications';
import { getExperiment, requestExperiment } from './experiment';

// Note this is only for updating the metadata portion of experiment
// get the latest metadata from the experiment
// we therefore do not include this payload in the reducer, nor provide a way to get its data

const module = createEntityModule('experiment', {
  typePrefix: 'experiments/experimentMetadata/',
  getState: state => state.experiments.experimentMetadata,
  initialData: {},
  update: {
    operationId: 'experimentUpdateMetadata',
    parameters: function*(parameters) {
      // add the current experiment id to the metadata payload
      const experiment = yield select(getExperiment);
      parameters.id = experiment.id;
      return yield parameters;
    },
    onSuccess: function*() {
      // yield put(push('/auth/signupsuccess'));
      // re-fetch the experiment
      const experiment = yield select(getExperiment);
      yield put(requestExperiment(experiment.id));
      yield put(showNotification('Metadata saved'));
    },
  },
});

const {
  actionType,
  actions: { updateEntity },
  selectors: { getError, getIsFetching },
  sagas: { entitySaga },
} = module;

export {
  updateEntity as updateExperimentMetadata,
  getError,
  getIsFetching,
  entitySaga as experimentMetadataSaga,
  actionType as experimentMetadataActionType,
};
