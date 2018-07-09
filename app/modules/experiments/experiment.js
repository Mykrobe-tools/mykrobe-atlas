/* @flow */

import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { showNotification } from 'makeandship-js-common/src/modules/notifications';
import { createEntityModule } from 'makeandship-js-common/src/modules/generic';

const module = createEntityModule('experiment', {
  typePrefix: 'experiments/experiment/',
  getState: state => state.experiments.experiment,
  initialData: {},
  create: {
    operationId: 'experimentsCreate',
    onSuccess: function*() {
      // yield put(showNotification('Experiment created'));
      // yield put(push('/experiments'));
    },
  },
  request: {
    operationId: 'experimentsGetById',
  },
  update: {
    operationId: 'experimentsUpdateById',
    onSuccess: function*() {
      // yield put(showNotification('Experiment updated'));
      // yield put(push('/experiments'));
    },
  },
  delete: {
    operationId: 'experimentsDeleteById',
    onSuccess: function*() {
      // yield put(showNotification('Experiment deleted'));
      // yield put(push('/experiments'));
    },
  },
});

const {
  reducer,
  actionType,
  actions: {
    newEntity,
    createEntity,
    requestEntity,
    updateEntity,
    deleteEntity,
  },
  selectors: { getEntity, getError, getIsFetching },
  sagas: { entitySaga },
} = module;

export {
  newEntity as newExperiment,
  createEntity as createExperiment,
  requestEntity as requestExperiment,
  updateEntity as updateExperiment,
  deleteEntity as deleteExperiment,
  getEntity as getExperiment,
  getError,
  getIsFetching,
  entitySaga as experimentSaga,
  actionType as experimentActionType,
};

export default reducer;
