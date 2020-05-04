/* @flow */

import { createFiltersModule } from 'makeandship-js-common/src/modules/generic';
import { createSyncFiltersWithReactRouterRedux } from 'makeandship-js-common/src/modules/generic/navigation/syncFiltersWithReactRouterRedux';

const module = createFiltersModule('organisationsFilters', {
  typePrefix: 'organisations/organisationsFilters/',
  getState: (state) => state.organisations.organisationsFilters,
});

const {
  reducer,
  actionTypes,
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
  actionTypes as organisationsFiltersActionTypes,
};

export default reducer;

const syncModule = createSyncFiltersWithReactRouterRedux({
  locationPathname: '/organisations',
  actionTypes,
  getFilters,
  setFilters,
});

const { syncFiltersWithReactRouterReduxSaga } = syncModule;

export { syncFiltersWithReactRouterReduxSaga as syncOrganisationsFiltersSaga };
