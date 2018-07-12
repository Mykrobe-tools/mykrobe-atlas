/* @flow */

import { createFiltersModule } from 'makeandship-js-common/src/modules/generic';

const module = createFiltersModule('experimentsFilters', {
  typePrefix: 'experiments/experimentsFilters',
  getState: state => state.experiments.experimentsFilters,
});

const {
  reducer,
  actionType,
  actions: { setFilters, resetFilters },
  selectors: { getFilters, getHasDataFilters },
  sagas: { getParameters },
} = module;

export {
  setFilters as setExperimentsFilters,
  resetFilters as resetExperimentsFilters,
  getFilters as getExperimentsFilters,
  getHasDataFilters as getExperimentsHasDataFilters,
  getParameters as getExperimentsFiltersParameters,
  actionType as experimentsFiltersActionType,
};

export default reducer;
