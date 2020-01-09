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
  stats: [
    {
      value: '1.1',
      valueUnit: 'k',
      description: 'Samples uploaded',
      badge: {
        type: 'gold',
        description: 'You are in the top 10% of sample uploaders',
        link: 'View samples',
        to: '/samples/123',
      },
    },
    {
      value: '57',
      valueUnit: '%',
      description: 'Samples with metadata',
      badge: {
        type: 'warn',
        description: 'You are in the bottom 20% for metadata completeness',
        link: 'How to improve',
        to: '/knowledge-base/123',
      },
    },
  ],
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
