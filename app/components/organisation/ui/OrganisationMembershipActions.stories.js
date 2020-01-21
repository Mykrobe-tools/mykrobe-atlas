/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Nav } from 'reactstrap';

import OrganisationMembershipActions from './OrganisationMembershipActions';

const variations = {
  default: {},
  owner: {
    currentUserStatus: 'owner',
  },
  ownerSmall: {
    currentUserStatus: 'owner',
    size: 'sm',
  },
  member: {
    currentUserStatus: 'member',
  },
  unapproved: {
    currentUserStatus: 'unapproved',
  },
  rejected: {
    currentUserStatus: 'rejected',
  },
};

storiesOf('OrganisationMembershipActions', module)
  .addDecorator(story => <Nav>{story()}</Nav>)
  .add('Default', () => (
    <OrganisationMembershipActions {...variations.default} />
  ))
  .add('Owner', () => <OrganisationMembershipActions {...variations.owner} />)
  .add('Owner small', () => (
    <OrganisationMembershipActions {...variations.ownerSmall} />
  ))
  .add('Member', () => <OrganisationMembershipActions {...variations.member} />)
  .add('Unapproved', () => (
    <OrganisationMembershipActions {...variations.unapproved} />
  ))
  .add('Rejected', () => (
    <OrganisationMembershipActions {...variations.rejected} />
  ));
