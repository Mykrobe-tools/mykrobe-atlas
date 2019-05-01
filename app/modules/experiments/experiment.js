/* @flow */

import {
  put,
  take,
  race,
  select,
  all,
  takeEvery,
  fork,
} from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { push } from 'connected-react-router';
import { createSelector } from 'reselect';
import _ from 'lodash';

import { showNotification, NotificationCategories } from '../notifications';
import { createEntityModule } from 'makeandship-js-common/src/modules/generic';
import { getCurrentUser } from '../../modules/users/currentUser';
import { ANALYSIS_COMPLETE } from '../../modules/users/currentUserEvents';

import AnalyserJsonTransformer from './util/AnalyserJsonTransformer';
import addExtraData from './util/addExtraData';

import {
  experimentMetadataSchema,
  completenessForSchemaAndData,
} from '../../schemas/experiment';

const ADD_EXTRA_DATA = false;

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
  actionTypes,
  actions: {
    newEntity,
    createEntity,
    requestEntity,
    updateEntity,
    deleteEntity,
    setEntity,
  },
  selectors: { getEntity, getError, getIsFetching },
  sagas: { entitySaga },
} = module;

// Selectors

export const getExperimentMetadata = createSelector(
  getEntity,
  experiment => experiment.metadata
);

export const getExperimentOwnerIsCurrentUser = createSelector(
  getEntity,
  getCurrentUser,
  (experiment, currentUser) => {
    return (
      currentUser &&
      experiment &&
      experiment.owner &&
      currentUser.id === experiment.owner.id
    );
  }
);

// TODO: remove once we are receiving sufficiently detailed data from API

export const getExperiment = createSelector(getEntity, experiment => {
  if (IS_ELECTRON) {
    return experiment;
  }
  if (ADD_EXTRA_DATA) {
    const experimentWithExtraData = addExtraData(experiment);
    return experimentWithExtraData;
  }
  return experiment;
});

export const getExperimentTransformed = createSelector(
  getExperiment,
  experiment => {
    const transformer = new AnalyserJsonTransformer();
    const transformed = transformer.transformModel(experiment);
    return transformed;
  }
);

export const getExperimentNearestNeigbours = createSelector(
  getExperiment,
  experiment => {
    return _.get(experiment, 'results.nearestNeighbours.experiments');
  }
);

export const getExperimentHasNearestNeigbours = createSelector(
  getExperimentNearestNeigbours,
  experimentNearestNeigbours =>
    experimentNearestNeigbours && experimentNearestNeigbours.length > 0
);

export const getExperimentMetadataCompletion = createSelector(
  getExperiment,
  experiment =>
    completenessForSchemaAndData(experimentMetadataSchema, experiment)
);

export {
  newEntity as newExperiment,
  setEntity as setExperiment,
  createEntity as createExperiment,
  requestEntity as requestExperiment,
  updateEntity as updateExperiment,
  deleteEntity as deleteExperiment,
  getError,
  getIsFetching,
  actionTypes as experimentActionTypes,
};

export default reducer;

// Side effects

export function* createExperimentId(): Saga {
  // create an id for the experiment
  yield put(createEntity());
  const { success } = yield race({
    success: take(actionTypes.CREATE_SUCCESS),
    failure: take(actionTypes.CREATE_FAILURE),
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

// reload experiment if it's the one we are currently viewing

function* analysisCompleteWatcher() {
  yield takeEvery(ANALYSIS_COMPLETE, function*(action) {
    const experimentId = action.payload.id;
    const experiment = yield select(getExperiment);
    if (experiment.id === experimentId) {
      yield put(requestEntity(experimentId));
    }
  });
}

export function* experimentSaga(): Saga {
  yield all([fork(entitySaga), fork(analysisCompleteWatcher)]);
}
