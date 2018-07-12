/* @flow */

import { all, fork } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import organisations, { organisationsSaga } from './organisations';
import organisation, { organisationSaga } from './organisation';

export {
  getIsFetching as getOrganisationsIsFetching,
  getError as getOrganisationsError,
  getOrganisations,
  requestOrganisations,
  organisationsSaga,
} from './organisations';

export {
  getIsFetching as getOrganisationIsFetching,
  getError as getOrganisationError,
  getOrganisation,
  newOrganisation,
  createOrganisation,
  requestOrganisation,
  updateOrganisation,
  deleteOrganisation,
  organisationSaga,
} from './organisation';

const reducer = combineReducers({
  organisations,
  organisation,
});

export default reducer;

export function* rootOrganisationsSaga(): Generator<*, *, *> {
  yield all([fork(organisationsSaga), fork(organisationSaga)]);
}
