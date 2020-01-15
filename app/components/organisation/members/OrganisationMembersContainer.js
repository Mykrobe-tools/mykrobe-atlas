/* @flow */

import { connect } from 'react-redux';
import { goBack, push } from 'connected-react-router';

import { isNewEntityKey } from 'makeandship-js-common/src/modules/generic';

import withOrganisation from '../../../hoc/withOrganisation';

import OrganisationMembers from './OrganisationMembers';

export const getOrganisationId = (props: any) =>
  props.match.params.organisationId;

const withRedux = connect(
  (state, ownProps) => ({
    organisationId: getOrganisationId(ownProps),
    isNew: isNewEntityKey(getOrganisationId(ownProps)),
  }),
  {
    push,
    goBack,
  }
);

export default withRedux(withOrganisation(OrganisationMembers));
