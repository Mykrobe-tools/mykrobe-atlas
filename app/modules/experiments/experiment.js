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
import { createSelector } from 'reselect';
import _get from 'lodash.get';
import _has from 'lodash.has';

import { showNotification, NotificationCategories } from '../notifications';
import { createEntityModule } from 'makeandship-js-common/src/modules/generic';
import { getCurrentUser } from '../../modules/users/currentUser';
import { ANALYSIS_COMPLETE } from '../../modules/users/currentUserEvents';

import AnalyserJsonTransformer from './util/AnalyserJsonTransformer';
import { getExperimentsTreeNewick } from './experimentsTree';
import {
  filterExperimentsInTree,
  filterExperimentsWithGeolocation,
} from './util/experiments';

import {
  experimentMetadataSchema,
  completenessForSchemaAndData,
} from '../../schemas/experiment';
import { getExperimentMetadataFormCompletion } from './experimentMetadataForm';

const module = createEntityModule('experiment', {
  typePrefix: 'experiments/experiment/',
  getState: (state) => state.experiments.experiment,
  initialData: {},
  create: {
    operationId: 'experimentsCreate',
  },
  request: {
    operationId: 'experimentsGetById',
  },
  update: {
    operationId: 'experimentsUpdateById',
    onSuccess: function* () {
      yield put(showNotification('Experiment saved'));
    },
  },
  delete: {
    operationId: 'experimentsDeleteById',
    onSuccess: function* () {
      yield put(showNotification('Experiment deleted'));
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
  selectors: { getEntity: getExperiment, getError, getIsFetching },
  sagas: { entitySaga },
} = module;

// Selectors

export const getExperimentMetadata = createSelector(
  getExperiment,
  (experiment) => experiment.metadata
);

export const getExperimentOwnerIsCurrentUser = createSelector(
  getExperiment,
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

export const getExperimentIsAnalysing = createSelector(
  getExperiment,
  getIsFetching,
  (experiment, isFetching) => {
    if (isFetching) {
      return false;
    }
    const hasPredictor = _has(experiment, 'results.predictor');
    return !hasPredictor;
  }
);

export const getExperimentIsolateId = createSelector(
  getExperimentMetadata,
  (metadata) => _get(metadata, 'sample.isolateId') || '–'
);

export const getExperimentTransformed = createSelector(
  getExperiment,
  (experiment) => {
    const transformer = new AnalyserJsonTransformer();
    const transformed = transformer.transformModel(experiment);
    return transformed;
  }
);

// highlighted with and without tree node

export const getExperimentInTree = createSelector(
  getExperimentsTreeNewick,
  getExperiment,
  (newick, experiment) => filterExperimentsInTree(newick, [experiment], true)
);

export const getExperimentNotInTree = createSelector(
  getExperimentsTreeNewick,
  getExperiment,
  (newick, experiment) => filterExperimentsInTree(newick, [experiment], false)
);

// nearest neighbours

export const getExperimentDistanceIsSearching = createSelector(
  getExperiment,
  getIsFetching,
  (experiment, isFetching) => {
    if (isFetching) {
      return false;
    }
    const hasDistance = _has(experiment, 'results.distance');
    return !hasDistance;
  }
);

export const getExperimentNearestNeigbours = createSelector(
  getExperiment,
  (experiment) => {
    const neighbours = _get(experiment, 'results.distance.experiments');
    // omit current sample if included
    if (neighbours) {
      const filtered = neighbours.filter(
        (neighbour) => neighbour.id !== experiment.id
      );
      return filtered;
    }
  }
);

export const getExperimentHasNearestNeigbours = createSelector(
  getExperimentNearestNeigbours,
  (experimentNearestNeigbours) =>
    experimentNearestNeigbours && experimentNearestNeigbours.length > 0
);

export const getExperimentMetadataCompletion = createSelector(
  getExperiment,
  (experiment) =>
    completenessForSchemaAndData(experimentMetadataSchema, experiment)
);

export const getExperimentMetadataLiveCompletion = createSelector(
  getExperimentMetadataFormCompletion,
  getExperimentMetadataCompletion,
  (experimentMetadataFormCompletion, experimentMetadataCompletion) => {
    // there is no form data and completion if it is unmodified, so fall back to pristine data
    const completion = experimentMetadataFormCompletion.complete
      ? experimentMetadataFormCompletion
      : experimentMetadataCompletion;
    return completion;
  }
);

export const getExperimentAndNearestNeigbours = createSelector(
  getExperiment,
  getExperimentNearestNeigbours,
  (experiment, experimentNearestNeigbours) => {
    let experiments = [experiment];
    if (experimentNearestNeigbours) {
      experiments = experiments.concat(experimentNearestNeigbours);
    }
    return experiments;
  }
);

// 'cliuster' = minimum spanning tree

export const getExperimentClusterIsSearching = createSelector(
  getExperiment,
  getIsFetching,
  (experiment, isFetching) => {
    if (isFetching) {
      return false;
    }
    const hasCluster = _has(experiment, 'results.cluster');
    return !hasCluster;
  }
);

export const getExperimentClusterRaw = createSelector(
  getExperiment,
  (experiment) => {
    return _get(experiment, 'results.cluster');
  }
);

// take the experiment cluster and enrich with in nearest neighbour info
export const getExperimentCluster = createSelector(
  getExperimentNearestNeigbours,
  getExperimentClusterRaw,
  (experimentNearestNeigbours, experimentClusterRaw) => {
    if (experimentClusterRaw && experimentNearestNeigbours) {
      experimentClusterRaw.nodes.forEach((node) => {
        node.experiments.forEach((nodeExperiment) => {
          const experimentNearestNeigbour = experimentNearestNeigbours.find(
            ({ id }) => id === nodeExperiment.id
          );
          if (experimentNearestNeigbour) {
            Object.assign(nodeExperiment, experimentNearestNeigbour);
          }
        });
      });
    }
    return experimentClusterRaw;
  }
);

// highlighted with and without tree node

export const getExperimentAndNearestNeigboursInTree = createSelector(
  getExperimentsTreeNewick,
  getExperimentAndNearestNeigbours,
  (newick, experiments) => {
    return filterExperimentsInTree(newick, experiments, true);
  }
);

export const getExperimentAndNearestNeigboursNotInTree = createSelector(
  getExperimentsTreeNewick,
  getExperimentAndNearestNeigbours,
  (newick, experiments) => filterExperimentsInTree(newick, experiments, false)
);

// highlighted with and without geolocation available

export const getExperimentAndNearestNeigboursWithGeolocation = createSelector(
  getExperimentAndNearestNeigbours,
  (experiments) => filterExperimentsWithGeolocation(experiments, true)
);

export const getExperimentAndNearestNeigboursWithoutGeolocation = createSelector(
  getExperimentAndNearestNeigbours,
  (experiments) => filterExperimentsWithGeolocation(experiments, false)
);

export {
  getExperiment,
  newEntity as newExperiment,
  setEntity as setExperiment,
  createEntity as createExperiment,
  requestEntity as requestExperiment,
  updateEntity as updateExperiment,
  deleteEntity as deleteExperiment,
  getError as getExperimentError,
  getIsFetching as getIsFetchingExperiment,
  actionTypes as experimentActionTypes,
};

export default reducer;

// Side effects

export function* createExperimentId(fileName: string): Saga {
  // create an id for the experiment
  // set the file name as isolateId
  yield put(
    createEntity({
      metadata: {
        sample: {
          isolateId: fileName,
        },
      },
    })
  );
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
  yield takeEvery(ANALYSIS_COMPLETE, function* (action) {
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
