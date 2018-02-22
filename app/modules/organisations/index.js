/* @flow */

import { combineReducers } from 'redux';
import organisations from './organisations';
import organisation from './organisation';

export {
  getIsFetching as getOrganisationsIsFetching,
  getError as getOrganisationsError,
  getOrganisations,
  getOrganisationsById,
  requestOrganisations,
} from './organisations';

export {
  getIsFetching as getOrganisationIsFetching,
  getError as getOrganisationError,
  getOrganisation,
  createOrUpdateOrganisation,
  createOrganisation,
  requestOrganisation,
  updateOrganisation,
  deleteOrganisation,
} from './organisation';

const reducer = combineReducers({
  organisations,
  organisation,
});

export default reducer;
