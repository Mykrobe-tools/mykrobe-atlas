/* @flow */

import { put, take, race, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { createSelector } from 'reselect';

import {
  SUCCESS,
  FAILURE,
  CREATE,
} from 'makeandship-js-common/src/modules/generic/actions';

import {
  showNotification,
  NotificationCategories,
} from 'makeandship-js-common/src/modules/notifications';
import { createEntityModule } from 'makeandship-js-common/src/modules/generic';

import AnalyserJsonTransformer from './AnalyserJsonTransformer';

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

// TODO: remove once we are receiving sufficiently detailed data from API

export const getExperiment = createSelector(getEntity, experiment => {
  if (IS_ELECTRON) {
    return experiment;
  }
  const experimentWithExtraData = addExtraData(experiment);
  return experimentWithExtraData;
});

export const getExperimentTransformed = createSelector(
  getExperiment,
  experiment => {
    const transformer = new AnalyserJsonTransformer();
    const transformed = transformer.transformModel(experiment);
    return transformed;
  }
);

export {
  newEntity as newExperiment,
  createEntity as createExperiment,
  requestEntity as requestExperiment,
  updateEntity as updateExperiment,
  deleteEntity as deleteExperiment,
  getError,
  getIsFetching,
  actionType as experimentActionType,
  entitySaga as experimentSaga,
};

export default reducer;

// Side effects

export function* createExperimentId(): Generator<*, *, *> {
  // create an id for the experiment
  yield put(createEntity());
  const { success } = yield race({
    success: take(actionType(CREATE, SUCCESS)),
    failure: take(actionType(CREATE, FAILURE)),
  });
  if (!success) {
    yield put(
      showNotification({
        category: NotificationCategories.ERROR,
        content: 'Unable to create new upload',
      })
    );
    return yield false;
  }
  const experiment = yield select(getExperiment);
  return yield experiment.id;
}
