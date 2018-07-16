/* @flow */

import {
  createFiltersModule,
  createSyncFiltersWithReactRouterRedux,
} from 'makeandship-js-common/src/modules/generic';

const module = createFiltersModule('organisationsFilters', {
  typePrefix: 'organisations/organisationsFilters',
  getState: state => state.organisations.organisationsFilters,
});

const {
  reducer,
  actionType,
  actions: { setFilters, resetFilters },
  selectors: { getFilters, getHasDataFilters },
  sagas: { getFiltersSaga },
} = module;

export {
  setFilters as setOrganisationsFilters,
  resetFilters as resetOrganisationsFilters,
  getFilters as getOrganisationsFilters,
  getHasDataFilters as getOrganisationsHasDataFilters,
  getFiltersSaga as getOrganisationsFiltersSaga,
  actionType as organisationsFiltersActionType,
};

export default reducer;

const syncModule = createSyncFiltersWithReactRouterRedux({
  locationPathname: '/organisations',
  actionType,
  getFilters,
  setFilters,
});

const { syncFiltersWithReactRouterReduxSaga } = syncModule;

export { syncFiltersWithReactRouterReduxSaga as syncOrganisationsFiltersSaga };
