/* @flow */

/* eslint-disable react/no-string-refs */

import * as React from 'react';
import PropTypes from 'prop-types';

import TabNavigation, {
  TabNavigationLink,
} from '../../ui/navigation/TabNavigation';
import HeaderContainer from '../../ui/header/HeaderContainer';
import { withOrganisationPropTypes } from '../../../hoc/withOrganisation';

class OrganisationHeader extends React.Component<*> {
  render() {
    const {
      isNew,
      organisation,
      organisationId,
      organisationCurrentUserIsOwner,
      organisationCurrentUserIsMember,
      organisationCurrentUserIsUnapprovedMember,
      organisationCurrentUserIsRejectedMember,
      organisationCurrentUserMemberId,
    } = this.props;
    const title = isNew
      ? 'New organistaion'
      : organisation
        ? organisation.name
        : 'Organisation';
    return (
      <React.Fragment>
        <pre>
          {JSON.stringify(
            {
              organisationId,
              organisationCurrentUserIsOwner,
              organisationCurrentUserIsMember,
              organisationCurrentUserIsUnapprovedMember,
              organisationCurrentUserIsRejectedMember,
              organisationCurrentUserMemberId,
            },
            null,
            2
          )}
        </pre>
        <HeaderContainer title={title} />
        {organisationCurrentUserIsOwner && (
          <TabNavigation>
            <TabNavigationLink exact to={`/organisations/${organisationId}`}>
              Profile
            </TabNavigationLink>
            <TabNavigationLink to={`/organisations/${organisationId}/members`}>
              Members
            </TabNavigationLink>
            <TabNavigationLink to={`/organisations/${organisationId}/edit`}>
              Settings
            </TabNavigationLink>
          </TabNavigation>
        )}
      </React.Fragment>
    );
  }
}

OrganisationHeader.propTypes = {
  ...withOrganisationPropTypes,
  match: PropTypes.object,
  isNew: PropTypes.bool,
  organisationId: PropTypes.string,
};

export default OrganisationHeader;
