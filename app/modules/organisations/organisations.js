/* @flow */

import { createCollectionModule } from 'makeandship-js-common/src/modules/generic';
import { getOrganisationsFiltersSaga } from './organisationsFilters';
import { createSelector } from 'reselect';
import produce from 'immer';

import { getCurrentUser } from '../../modules/users/currentUser';

import { getOrganisationCurrentUserStatus } from './organisation';

const collectionName = 'organisations';

const module = createCollectionModule(collectionName, {
  operationId: 'organisationsList',
  parameters: getOrganisationsFiltersSaga,
  initialData: [],
});

const {
  reducer,
  actionTypes: organisationsActionTypes,
  actions: { requestCollection: requestOrganisations },
  selectors: {
    getCollection: getOrganisations,
    getError: getOrganisationsError,
    getIsFetching: getOrganisationsIsFetching,
  },
  sagas: { collectionSaga: organisationsSaga },
} = module;

// Membership

// selectors

export const getOrganisationsWithCurrentUserStatus = createSelector(
  getOrganisations,
  getCurrentUser,
  (organisations, currentUser) =>
    produce(organisations, draft => {
      draft.forEach(organisation => {
        organisation.currentUserStatus = getOrganisationCurrentUserStatus(
          organisation,
          currentUser
        );
      });
    })
);

export {
  organisationsActionTypes,
  requestOrganisations,
  getOrganisations,
  getOrganisationsError,
  getOrganisationsIsFetching,
  organisationsSaga,
};

export default reducer;
