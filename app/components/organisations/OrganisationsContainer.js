/* @flow */

import { connect } from 'react-redux';

import {
  getOrganisations,
  getOrganisationsWithCurrentUserStatus,
  getOrganisationIsFetching,
  requestOrganisations,
  newOrganisation,
  getOrganisationsFilters,
  setOrganisationsFilters,
} from '../../modules/organisations';

import Organisations from './Organisations';

const withRedux = connect(
  state => ({
    organisations: getOrganisations(state),
    organisationsWithCurrentUserStatus: getOrganisationsWithCurrentUserStatus(
      state
    ),
    isFetching: getOrganisationIsFetching(state),
    organisationsFilters: getOrganisationsFilters(state),
  }),
  {
    requestOrganisations,
    newOrganisation,
    setOrganisationsFilters,
  }
);

export default withRedux(Organisations);
