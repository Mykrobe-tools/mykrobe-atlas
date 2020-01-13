/* @flow */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getOrganisation,
  getOrganisationIsFetching,
  getOrganisationError,
  newOrganisation,
  createOrganisation,
  requestOrganisation,
  updateOrganisation,
  deleteOrganisation,
  joinOrganisation,
  getOrganisationCurrentUserIsOwner,
  getOrganisationCurrentUserIsMember,
  getOrganisationCurrentUserIsUnapprovedMember,
  getOrganisationCurrentUserIsRejectedMember,
} from '../modules/organisations/organisation';

const withOrganisation = connect(
  state => ({
    organisation: getOrganisation(state),
    organisationIsFetching: getOrganisationIsFetching(state),
    organisationError: getOrganisationError(state),
    organisationCurrentUserIsOwner: getOrganisationCurrentUserIsOwner(state),
    organisationCurrentUserIsMember: getOrganisationCurrentUserIsMember(state),
    organisationCurrentUserIsUnapprovedMember: getOrganisationCurrentUserIsUnapprovedMember(
      state
    ),
    organisationCurrentUserIsRejectedMember: getOrganisationCurrentUserIsRejectedMember(
      state
    ),
  }),
  {
    newOrganisation,
    createOrganisation,
    requestOrganisation,
    updateOrganisation,
    deleteOrganisation,
    joinOrganisation,
  }
);

export const withOrganisationPropTypes = {
  organisation: PropTypes.object,
  organisationIsFetching: PropTypes.bool,
  organisationError: PropTypes.any,
  newOrganisation: PropTypes.func,
  createOrganisation: PropTypes.func,
  requestOrganisation: PropTypes.func,
  updateOrganisation: PropTypes.func,
  deleteOrganisation: PropTypes.func,
  joinOrganisation: PropTypes.func,
  organisationCurrentUserIsOwner: PropTypes.bool,
  organisationCurrentUserIsMember: PropTypes.bool,
  organisationCurrentUserIsUnapprovedMember: PropTypes.bool,
  organisationCurrentUserIsRejectedMember: PropTypes.bool,
};

export default withOrganisation;
