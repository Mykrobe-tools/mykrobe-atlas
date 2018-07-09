/* @flow */

import { all, fork } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import experiments, { experimentsSaga } from './experiments';
import experiment, { experimentSaga } from './experiment';
import experimentFile, { experimentFileSaga } from './experimentFile';
import experimentMetadata, {
  experimentMetadataSaga,
} from './experimentMetadata';
import filters from './filters';

export {
  getExperiments,
  getIsFetching as getIsFetchingExperiments,
  requestExperiments,
  experimentsSaga,
} from './experiments';

export {
  getExperiment,
  getIsFetching as getIsFetchingExperiment,
  createExperiment,
  requestExperiment,
  updateExperiment,
  deleteExperiment,
  experimentSaga,
} from './experiment';

export {
  updateExperimentFile,
  getIsFetching as getIsFetchingExperimentFile,
  experimentFileSaga,
} from './experimentFile';

export {
  updateExperimentMetadata,
  getIsFetching as getIsFetchingExperimentMetadata,
  experimentMetadataSaga,
} from './experimentMetadata';

export {
  getIsFetching as getIsFetchingFilters,
  getFilterValues,
  requestFilterValues,
} from './filters';

const reducer = combineReducers({
  experiments,
  experiment,
  experimentFile,
  experimentMetadata,
  filters,
});

export default reducer;

export function* rootExperimentsSaga(): Generator<*, *, *> {
  yield all([
    fork(experimentsSaga),
    fork(experimentSaga),
    fork(experimentFileSaga),
    fork(experimentMetadataSaga),
  ]);
}
