/* @flow */

import { all, fork } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { combineReducers } from 'redux';

import organisations, { organisationsSaga } from './organisations';
import organisation, { organisationSaga } from './organisation';
import organisationsFilters, {
  syncOrganisationsFiltersSaga,
} from './organisationsFilters';

export {
  getOrganisationsIsFetching,
  getOrganisationsError,
  getOrganisations,
  getOrganisationsWithCurrentUserStatus,
  requestOrganisations,
  organisationsSaga,
} from './organisations';

export {
  getOrganisationIsFetching,
  getOrganisationError,
  getOrganisation,
  newOrganisation,
  createOrganisation,
  requestOrganisation,
  updateOrganisation,
  deleteOrganisation,
  organisationSaga,
  joinOrganisation,
  approveJoinOrganisationRequest,
  rejectJoinOrganisationRequest,
  removeOrganisationMember,
  promoteOrganisationMember,
  demoteOrganisationOwner,
} from './organisation';

export {
  setOrganisationsFilters,
  resetOrganisationsFilters,
  getOrganisationsFilters,
  getOrganisationsHasDataFilters,
  getOrganisationsFiltersSaga,
  organisationsFiltersActionTypes,
} from './organisationsFilters';

const reducer = combineReducers({
  organisations,
  organisationsFilters,
  organisation,
});

export default reducer;

export function* rootOrganisationsSaga(): Saga {
  yield all([
    fork(organisationsSaga),
    fork(organisationSaga),
    fork(syncOrganisationsFiltersSaga),
  ]);
}
