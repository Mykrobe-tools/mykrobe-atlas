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
} from '../modules/organisations/organisation';

import {
  joinOrganisation,
  approveJoinOrganisationRequest,
  rejectJoinOrganisationRequest,
  removeOrganisationMember,
  promoteOrganisationMember,
  demoteOrganisationOwner,
  getOrganisationCurrentUserIsOwner,
  getOrganisationCurrentUserIsMember,
  getOrganisationCurrentUserIsUnapprovedMember,
  getOrganisationCurrentUserIsRejectedMember,
  getOrganisationCurrentUserStatus,
  getOrganisationCurrentUserMemberId,
  getOrganisationAllMembers,
  getOrganisationMembersIsFetching,
  getOrganisationMembersError,
} from '../modules/organisations/organisationMembers';

const withOrganisation = connect(
  (state) => ({
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
    organisationCurrentUserStatus: getOrganisationCurrentUserStatus(state),
    organisationCurrentUserMemberId: getOrganisationCurrentUserMemberId(state),
    organisationAllMembers: getOrganisationAllMembers(state),
    organisationMembersIsFetching: getOrganisationMembersIsFetching(state),
    organisationMembersError: getOrganisationMembersError(state),
  }),
  {
    newOrganisation,
    createOrganisation,
    requestOrganisation,
    updateOrganisation,
    deleteOrganisation,
    joinOrganisation,
    approveJoinOrganisationRequest,
    rejectJoinOrganisationRequest,
    removeOrganisationMember,
    promoteOrganisationMember,
    demoteOrganisationOwner,
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
  approveJoinOrganisationRequest: PropTypes.func,
  rejectJoinOrganisationRequest: PropTypes.func,
  removeOrganisationMember: PropTypes.func,
  promoteOrganisationMember: PropTypes.func,
  demoteOrganisationOwner: PropTypes.func,
  organisationCurrentUserIsOwner: PropTypes.bool,
  organisationCurrentUserIsMember: PropTypes.bool,
  organisationCurrentUserIsUnapprovedMember: PropTypes.bool,
  organisationCurrentUserIsRejectedMember: PropTypes.bool,
  organisationCurrentUserStatus: PropTypes.any,
  organisationCurrentUserMemberId: PropTypes.any,
  organisationAllMembers: PropTypes.array,
  organisationMembersIsFetching: PropTypes.bool,
  organisationMembersError: PropTypes.any,
};

export default withOrganisation;
