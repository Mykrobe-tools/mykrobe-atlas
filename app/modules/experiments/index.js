/* @flow */

import { all, fork } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import experiments, { experimentsSaga } from './experiments';
import experiment, { experimentSaga } from './experiment';
import { experimentFileSaga } from './experimentFile';
import { experimentProviderSaga } from './experimentProvider';
import { experimentMetadataSaga } from './experimentMetadata';
import experimentMetadataTemplate, {
  experimentMetadataTemplateSaga,
} from './experimentMetadataTemplate';
import experimentsFilters, {
  syncExperimentsFiltersSaga,
} from './experimentsFilters';
import experimentsChoices, {
  experimentsChoicesSaga,
} from './experimentsChoices';

export {
  getExperiments,
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
  getExperimentsFiltersSaga,
  experimentsFiltersActionType,
} from './experimentsFilters';

export {
  getExperiment,
  getExperimentTransformed,
  getExperimentMetadata,
  getIsFetching as getIsFetchingExperiment,
  createExperiment,
  requestExperiment,
  updateExperiment,
  deleteExperiment,
  experimentSaga,
  createExperimentId,
  newExperiment,
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
  updateExperimentMetadata,
  getIsFetching as getIsFetchingExperimentMetadata,
  experimentMetadataSaga,
} from './experimentMetadata';

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

export function* rootExperimentsSaga(): Generator<*, *, *> {
  yield all([
    fork(experimentsSaga),
    fork(experimentsChoicesSaga),
    fork(experimentSaga),
    fork(experimentFileSaga),
    fork(experimentMetadataSaga),
    fork(experimentMetadataTemplateSaga),
    fork(experimentProviderSaga),
    fork(syncExperimentsFiltersSaga),
  ]);
}
