/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import ConnectedStorybook from '../../../util/ConnectedStorybook';

import OrganisationProfile from './OrganisationProfile';

const organisation = {
  id: '123',
  name: 'Acme Corporation',
  description:
    'A fictional corporation that features prominently as a running gag featuring outlandish products that fail or backfire catastrophically at the worst possible times.',
};

const variations = {
  default: {
    organisation,
  },
  member: {
    organisation,
    currentUserStatus: 'member',
  },
  memberAndAdmin: {
    organisation,
    currentUserStatus: 'member',
    currentUserRole: 'admin',
  },
  requested: {
    organisation,
    currentUserStatus: 'requested',
  },
  invited: {
    organisation,
    currentUserStatus: 'invited',
  },
  declined: {
    organisation,
    currentUserStatus: 'declined',
  },
};

storiesOf('OrganisationProfile', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .addDecorator(story => <ConnectedStorybook story={story()} />)
  .add('Default', () => <OrganisationProfile {...variations.default} />)
  .add('Member', () => <OrganisationProfile {...variations.member} />)
  .add('Member, Admin', () => (
    <OrganisationProfile {...variations.memberAndAdmin} />
  ))
  .add('Requested', () => <OrganisationProfile {...variations.requested} />)
  .add('Invited', () => <OrganisationProfile {...variations.invited} />)
  .add('Declined', () => <OrganisationProfile {...variations.declined} />);
