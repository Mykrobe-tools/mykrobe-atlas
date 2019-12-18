/* @flow */

import { connect } from 'react-redux';
import { goBack, push } from 'connected-react-router';

import { isNewEntityKey } from 'makeandship-js-common/src/modules/generic';

import {
  getOrganisation,
  getOrganisationIsFetching,
  getOrganisationError,
  createOrganisation,
  requestOrganisation,
  updateOrganisation,
  deleteOrganisation,
} from '../../../modules/organisations';

import EditOrganisation from './EditOrganisation';

export const getOrganisationId = (props: any) =>
  props.match.params.organisationId;

const withRedux = connect(
  (state, ownProps) => ({
    organisation: getOrganisation(state),
    isFetching: getOrganisationIsFetching(state),
    error: getOrganisationError(state),
    organisationId: getOrganisationId(ownProps),
    isNew: isNewEntityKey(getOrganisationId(ownProps)),
  }),
  {
    createOrganisation,
    requestOrganisation,
    updateOrganisation,
    deleteOrganisation,
    push,
    goBack,
  }
);

export default withRedux(EditOrganisation);
