/* @flow */

import { createCollectionModule } from 'makeandship-js-common/src/modules/generic';
import { getOrganisationsFiltersSaga } from './organisationsFilters';

const collectionName = 'organisations';

const module = createCollectionModule(collectionName, {
  operationId: 'organisationsList',
  parameters: getOrganisationsFiltersSaga,
  initialData: [],
});

const {
  reducer,
  actionTypes,
  actions: { requestCollection },
  selectors: { getCollection, getError, getIsFetching },
  sagas: { collectionSaga },
} = module;

export {
  actionTypes as organisationsActionTypes,
  requestCollection as requestOrganisations,
  getCollection as getOrganisations,
  getError,
  getIsFetching,
  collectionSaga as organisationsSaga,
};

export default reducer;
