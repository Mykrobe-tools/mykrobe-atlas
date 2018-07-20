/* @flow */

import {
  createFiltersModule,
  createSyncFiltersWithReactRouterRedux,
} from 'makeandship-js-common/src/modules/generic';

const module = createFiltersModule('experimentsFilters', {
  typePrefix: 'experiments/experimentsFilters/',
  getState: state => state.experiments.experimentsFilters,
});

const {
  reducer,
  actionType,
  actions: { setFilters, resetFilters },
  selectors: { getFilters, getDataFilters, getHasDataFilters },
  sagas: { getFiltersSaga },
} = module;

export {
  setFilters as setExperimentsFilters,
  resetFilters as resetExperimentsFilters,
  getFilters as getExperimentsFilters,
  getDataFilters as getExperimentsDataFilters,
  getHasDataFilters as getExperimentsHasDataFilters,
  getFiltersSaga as getExperimentsFiltersSaga,
  actionType as experimentsFiltersActionType,
};

export default reducer;

const syncModule = createSyncFiltersWithReactRouterRedux({
  locationPathname: '/experiments',
  actionType,
  getFilters,
  setFilters,
});

const { syncFiltersWithReactRouterReduxSaga } = syncModule;

export { syncFiltersWithReactRouterReduxSaga as syncExperimentsFiltersSaga };
