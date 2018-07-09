/* @flow */

import { all, fork } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import experiments, { experimentsSaga } from './experiments';
import filters from './filters';

export {
  getExperiments,
  getIsFetching as getIsFetchingExperiments,
  getSamples,
  getTotal,
  requestExperiments,
  createExperiment,
  uploadExperimentFile,
  experimentsSaga,
} from './experiments';

export {
  getIsFetching as getIsFetchingFilters,
  getFilterValues,
  requestFilterValues,
} from './filters';

const reducer = combineReducers({
  experiments,
  filters,
});

export default reducer;

export function* rootExperimentsSaga(): Generator<*, *, *> {
  yield all([fork(experimentsSaga)]);
}
