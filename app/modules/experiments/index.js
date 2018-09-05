/* @flow */

import { all, fork } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { combineReducers } from 'redux';

import experiments, { experimentsSaga } from './experiments';
import experiment, { experimentSaga } from './experiment';
import { experimentFileSaga } from './experimentFile';
import { experimentProviderSaga } from './experimentProvider';
import experimentMetadataTemplate, {
  experimentMetadataTemplateSaga,
} from './experimentMetadataTemplate';
import experimentsFilters, {
  syncExperimentsFiltersSaga,
} from './experimentsFilters';
import experimentsChoices, {
  experimentsChoicesSaga,
} from './experimentsChoices';
import { experimentsFiltersChoicesSaga } from './experimentsFiltersChoices';

export {
  getExperiments,
  getError as getExperimentError,
  getIsFetching as getIsFetchingExperiments,
  requestExperiments,
  experimentsSaga,
} from './experiments';

export {
  setExperimentsFilters,
  resetExperimentsFilters,
  getExperimentsFilters,
  getExperimentsDataFilters,
  getExperimentsHasDataFilters,
  getExperimentsChoicesFilters,
  getExperimentsHasChoicesFilters,
  getExperimentsFiltersSaga,
  experimentsFiltersActionTypes,
} from './experimentsFilters';

export {
  getExperiment,
  getExperimentTransformed,
  getExperimentMetadata,
  getExperimentOwnerIsCurrentUser,
  getExperimentNearestNeigbours,
  getExperimentHasNearestNeigbours,
  getIsFetching as getIsFetchingExperiment,
  createExperiment,
  requestExperiment,
  updateExperiment,
  deleteExperiment,
  experimentSaga,
  createExperimentId,
  newExperiment,
  setExperiment,
} from './experiment';

export {
  updateExperimentFile,
  getIsFetching as getIsFetchingExperimentFile,
  experimentFileSaga,
} from './experimentFile';

export {
  updateExperimentProvider,
  getIsFetching as getIsFetchingExperimentProvider,
  experimentProviderSaga,
} from './experimentProvider';

export {
  requestExperimentMetadataTemplate,
  getExperimentMetadataTemplate,
  getIsFetching as getIsFetchingExperimentMetadataTemplate,
  experimentMetadataTemplateSaga,
} from './experimentMetadataTemplate';

export {
  requestExperimentsChoices,
  getExperimentsChoices,
  getError as getExperimentsChoicesError,
  getIsFetching as getIsFetchingExperimentsChoices,
  experimentsChoicesSaga,
} from './experimentsChoices';

const reducer = combineReducers({
  experiments,
  experimentsFilters,
  experimentsChoices,
  experiment,
  experimentMetadataTemplate,
});

export default reducer;

export function* rootExperimentsSaga(): Saga {
  yield all([
    fork(experimentsSaga),
    fork(experimentsChoicesSaga),
    fork(experimentSaga),
    fork(experimentFileSaga),
    fork(experimentMetadataTemplateSaga),
    fork(experimentProviderSaga),
    fork(experimentsFiltersChoicesSaga),
    fork(syncExperimentsFiltersSaga),
  ]);
}
