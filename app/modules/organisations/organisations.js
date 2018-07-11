/* @flow */

import { createCollectionModule } from 'makeandship-js-common/src/modules/generic';
// import { getFiltersParameters } from './organisationsFilters';

const collectionName = 'organisations';

// TODO: implement geenric filter parameters module - read <-> location search string in web client

const module = createCollectionModule(collectionName, {
  operationId: 'organisationsList',
  // parameters: getFiltersParameters,
  initialData: [],
});

const {
  reducer,
  actionType,
  actions: { requestCollection },
  selectors: { getCollection, getError, getIsFetching },
  sagas: { collectionSaga },
} = module;

export {
  actionType as organisationsActionType,
  requestCollection as requestOrganisations,
  getCollection as getOrganisations,
  getError,
  getIsFetching,
  collectionSaga as organisationsSaga,
};

export default reducer;
