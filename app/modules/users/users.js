/* @flow */

import { createCollectionModule } from 'makeandship-js-common/src/modules/generic';
import { addQueryToUrl } from '../location';

const collectionName = 'users';

const module = createCollectionModule(collectionName, {
  url: addQueryToUrl,
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
