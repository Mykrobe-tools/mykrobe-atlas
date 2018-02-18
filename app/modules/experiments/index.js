/* @flow */

import { combineReducers } from 'redux';
import experiments from './experiments';
import filters from './filters';

export {
  getExperiments,
  getIsFetching as getIsFetchingExperiments,
  getSamples,
  getTotal,
  fetchExperiments,
} from './experiments';

export {
  getIsFetching as getIsFetchingFilters,
  getFilterValues,
  fetchFilterValues,
} from './filters';

const reducer = combineReducers({
  experiments,
  filters,
});

export default reducer;
