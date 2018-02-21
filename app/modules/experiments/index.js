/* @flow */

import { combineReducers } from 'redux';
import experiments from './experiments';
import filters from './filters';

export {
  getExperiments,
  getIsFetching as getIsFetchingExperiments,
  getSamples,
  getTotal,
  requestExperiments,
  prepareNewExperiment,
  uploadExperimentFile,
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
