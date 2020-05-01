/* @flow */

import { createFiltersModule } from 'makeandship-js-common/src/modules/generic';
import { createSyncFiltersWithReactRouterRedux } from 'makeandship-js-common/src/modules/generic/navigation/syncFiltersWithReactRouterRedux';

const module = createFiltersModule('usersFilters', {
  typePrefix: 'users/usersFilters/',
  getState: (state) => state.users.usersFilters,
});

const {
  reducer,
  actionTypes,
  actions: { setFilters, resetFilters },
  selectors: { getFilters, getHasDataFilters },
  sagas: { getFiltersSaga },
} = module;

export {
  setFilters as setUsersFilters,
  resetFilters as resetUsersFilters,
  getFilters as getUsersFilters,
  getHasDataFilters as getUsersHasDataFilters,
  getFiltersSaga as getUsersFiltersSaga,
  actionTypes as usersFiltersActionTypes,
};

export default reducer;

const syncModule = createSyncFiltersWithReactRouterRedux({
  locationPathname: '/users',
  actionTypes,
  getFilters,
  setFilters,
});

const { syncFiltersWithReactRouterReduxSaga } = syncModule;

export { syncFiltersWithReactRouterReduxSaga as syncUsersFiltersSaga };
