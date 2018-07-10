/* @flow */

import { all, fork, takeEvery, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { createSelector } from 'reselect';

import {
  CREATE,
  REQUEST,
  UPDATE,
  SUCCESS,
  SET,
} from 'makeandship-js-common/src/modules/generic/actions';
import { showNotification } from 'makeandship-js-common/src/modules/notifications';
import { createEntityModule } from 'makeandship-js-common/src/modules/generic';

import { addExtraData } from './utils';

const module = createEntityModule('experiment', {
  typePrefix: 'experiments/experiment/',
  getState: state => state.experiments.experiment,
  initialData: {},
  create: {
    operationId: 'experimentsCreate',
    // url: function*(url) {
    //   return yield 'http://localhost:3001/experiments';
    // },
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
      yield put(showNotification('Experiment saved'));
      // yield put(push('/experiments'));
    },
  },
  delete: {
    operationId: 'experimentsDeleteById',
    onSuccess: function*() {
      yield put(showNotification('Experiment deleted'));
      yield put(push('/experiments'));
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

// Selectors

export const getExperimentMetadata = createSelector(
  getEntity,
  experiment => experiment.metadata
);

export {
  newEntity as newExperiment,
  createEntity as createExperiment,
  requestEntity as requestExperiment,
  updateEntity as updateExperiment,
  deleteEntity as deleteExperiment,
  getEntity as getExperiment,
  getError,
  getIsFetching,
  actionType as experimentActionType,
};

export default reducer;

// Side effects

export function* experimentWatcher(): Generator<*, *, *> {
  yield takeEvery(
    [
      actionType(CREATE, SUCCESS),
      actionType(REQUEST, SUCCESS),
      actionType(UPDATE, SUCCESS),
    ],
    experimentWorker
  );
}

export function* experimentWorker(): Generator<*, *, *> {
  const experiment = yield select(getEntity);
  const experimentWithExtraData = addExtraData(experiment);
  yield put({ type: actionType(SET), payload: experimentWithExtraData });

  // TODO: also create transformed data
  const transformer = new AnalyserJsonTransformer();
  const transformed = transformer.transformModel(json);
}

export function* experimentSaga(): Generator<*, *, *> {
  const sagas = [entitySaga, experimentWatcher];
  yield all(sagas.map(saga => fork(saga)));
}
