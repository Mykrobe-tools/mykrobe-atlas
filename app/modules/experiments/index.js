/* @flow */

import { all, fork } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import experiments, { experimentsSaga } from './experiments';
import experiment, { experimentSaga } from './experiment';
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
  getIsFetching as getIsFetchingFilters,
  getFilterValues,
  requestFilterValues,
} from './filters';

const reducer = combineReducers({
  experiments,
  experiment,
  filters,
});

export default reducer;

export function* rootExperimentsSaga(): Generator<*, *, *> {
  yield all([fork(experimentsSaga), fork(experimentSaga)]);
}
