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
  actionTypes,
  actions: { setFilters, resetFilters },
  selectors: {
    getFilters,
    getDataFilters,
    getHasDataFilters,
    getChoicesFilters,
    getHasChoicesFilters,
  },
  sagas: { getFiltersSaga, getDataFiltersSaga, getChoicesFiltersSaga },
} = module;

export {
  setFilters as setExperimentsFilters,
  resetFilters as resetExperimentsFilters,
  getFilters as getExperimentsFilters,
  getDataFilters as getExperimentsDataFilters,
  getHasDataFilters as getExperimentsHasDataFilters,
  getChoicesFilters as getExperimentsChoicesFilters,
  getHasChoicesFilters as getExperimentsHasChoicesFilters,
  getFiltersSaga as getExperimentsFiltersSaga,
  getDataFiltersSaga as getExperimentsDataFiltersSaga,
  getChoicesFiltersSaga as getExperimentsChoicesFiltersSaga,
  actionTypes as experimentsFiltersActionTypes,
};

export default reducer;

const syncModule = createSyncFiltersWithReactRouterRedux({
  locationPathname: '/experiments',
  actionTypes,
  getFilters,
  setFilters,
});

const { syncFiltersWithReactRouterReduxSaga } = syncModule;

export { syncFiltersWithReactRouterReduxSaga as syncExperimentsFiltersSaga };
