/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import ConnectedStorybook from '../../util/storybook/ConnectedStorybook';

import Organisations from './Organisations';

const organisations = [
  {
    id: '123',
    name: 'Acme Corporation',
    template: 'Lorem ipsum',
  },
];

const organisationsWithCurrentUserStatus = [
  {
    id: '123',
    name: 'Acme Corporation',
    template: 'Lorem ipsum',
    currentUserStatus: 'owner',
  },
];

const organisationsFilters = {};

const variations = {
  default: {
    organisations,
    organisationsWithCurrentUserStatus,
    organisationsFilters,
  },
};

storiesOf('Organisations', module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .addDecorator((story) => <ConnectedStorybook story={story()} />)
  .add('Default', () => <Organisations {...variations.default} />);
