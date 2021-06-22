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
import produce from 'immer';

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
import { selectors as experimentSettingsSelectors } from './experimentSettings';

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
  experimentSettingsSelectors.getDistanceThreshold,
  (experiment, distanceThreshold) => {
    const neighbours = _get(experiment, 'results.distance.experiments');
    // omit current sample if included
    if (neighbours) {
      const filtered = neighbours.filter(
        (neighbour) =>
          neighbour.id !== experiment.id &&
          neighbour.distance <= distanceThreshold
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

export const getExperimentCluster = createSelector(
  getExperiment,
  getExperimentNearestNeigbours,
  getExperimentClusterRaw,
  experimentSettingsSelectors.getDistanceThreshold,
  (
    experiment,
    experimentNearestNeigbours,
    experimentClusterRaw,
    distanceThreshold
  ) => {
    // if (experimentClusterRaw) {
    //   // local optimisation - make sure start < end
    //   experimentClusterRaw.distance.forEach((edge) => {
    //     if (edge.start > edge.end) {
    //       const temp = edge.start;
    //       edge.start = edge.end;
    //       edge.end = temp;
    //     }
    //   });
    //   console.log(JSON.stringify(experimentClusterRaw.distance, null, 2));
    // }
    if (experimentClusterRaw && experimentNearestNeigbours) {
      // take the experiment cluster and enrich with in nearest neighbour info
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
    // filter based on sum distance from the root node representing experiment
    if (experiment && experimentClusterRaw) {
      const rootNode = experimentClusterRaw.nodes.find((node) => {
        const rootNodeExperiment = node.experiments.find((nodeExperiment) => {
          return nodeExperiment.id === experiment.id;
        });
        if (rootNodeExperiment) {
          return true;
        }
      });
      if (rootNode) {
        const edgesWithId = (id) =>
          experimentClusterRaw.distance.filter(
            ({ start, end }) => start == id || end == id
          );
        const mapNodeIdToDistance = {};

        // traverse without going back to edges with previous node id
        const traverseEdge = ({ previousNodeId, edge, sumDistance = 0 }) => {
          const { start, end, distance } = edge;
          sumDistance += distance;

          const nextNodeId = start == previousNodeId ? end : start;
          mapNodeIdToDistance[nextNodeId] = sumDistance;

          // console.log(`${previousNodeId} -> ${nextNodeId} (${distance})`);

          const nextEdges = edgesWithId(nextNodeId).filter(
            ({ start, end }) => start != previousNodeId && end != previousNodeId
          );

          // console.log(nextEdges);
          if (nextEdges.length > 0) {
            nextEdges.forEach((nextEdge) => {
              traverseEdge({
                edge: nextEdge,
                previousNodeId: nextNodeId,
                sumDistance,
              });
            });
          }
        };

        const startEdges = edgesWithId(rootNode.id);
        mapNodeIdToDistance[rootNode.id] = 0;
        startEdges.forEach((startEdge) => {
          traverseEdge({ previousNodeId: rootNode.id, edge: startEdge });
        });
        // filter nodes with sum distance <= threshold
        const nodesIdsToInclude = Object.entries(mapNodeIdToDistance).flatMap(
          ([nodeIdString, sumDistance]) => {
            if (sumDistance <= distanceThreshold) {
              return parseInt(nodeIdString);
            }
            return [];
          }
        );
        console.log({ mapNodeIdToDistance, nodesIdsToInclude });
        const filteredExperimentClusterRaw = produce(
          experimentClusterRaw,
          (draft) => {
            draft.nodes = draft.nodes.filter(({ id }) =>
              nodesIdsToInclude.includes(id)
            );
            draft.distance = draft.distance.filter(
              ({ start, end }) =>
                nodesIdsToInclude.includes(start) &&
                nodesIdsToInclude.includes(end)
            );
          }
        );
        return filteredExperimentClusterRaw;
      }
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
