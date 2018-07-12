/* @flow */

import { createCollectionModule } from 'makeandship-js-common/src/modules/generic';
import { getUsersFiltersSaga } from './usersFilters';

const module = createCollectionModule('users', {
  operationId: 'usersList',
  parameters: getUsersFiltersSaga,
});

const {
  reducer,
  actionType,
  actions: { requestCollection },
  selectors: { getCollection, getError, getIsFetching },
  sagas: { collectionSaga },
} = module;

export {
  requestCollection as requestUsers,
  getCollection as getUsers,
  getError,
  getIsFetching,
  collectionSaga as usersSaga,
  actionType as usersActionType,
};

export default reducer;
