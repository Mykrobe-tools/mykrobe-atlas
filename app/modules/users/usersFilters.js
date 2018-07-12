/* @flow */

import {
  createFiltersModule,
  createSyncFiltersWithReactRouterRedux,
} from 'makeandship-js-common/src/modules/generic';

const module = createFiltersModule('usersFilters', {
  typePrefix: 'users/usersFilters',
  getState: state => state.users.usersFilters,
});

const {
  reducer,
  actionType,
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
  actionType as usersFiltersActionType,
};

export default reducer;

const syncModule = createSyncFiltersWithReactRouterRedux({
  locationPathname: '/users',
  actionType,
  getFilters,
  setFilters,
});

const { syncFiltersWithReactRouterReduxSaga } = syncModule;

export { syncFiltersWithReactRouterReduxSaga as syncUsersFiltersSaga };
