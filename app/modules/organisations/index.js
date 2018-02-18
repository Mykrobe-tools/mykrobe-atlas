/* @flow */

import { combineReducers } from 'redux';
import organisations from './organisations';

export {
  getIsFetching,
  getIsSaving,
  getOrganisations,
  getOrganisationsById,
  getFailureReason,
  updateFailureReason,
  deleteFailureReason,
  requestAllOrganisations,
  requestOrganisation,
  createOrUpdateOrganisation,
  createOrganisation,
  updateOrganisation,
  deleteOrganisation,
} from './organisations';

const reducer = combineReducers({
  organisations,
});

export default reducer;
