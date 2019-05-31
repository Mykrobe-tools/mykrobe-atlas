/* @flow */

import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { storiesOf } from '@storybook/react';

import ConnectedStorybook from '../../util/ConnectedStorybook';

import Experiments from './Experiments';

const experiments = {
  results: [],
};

const experimentsFilters = {
  q: '',
};

const experimentsSearchDescription = 'Search storybook';

const variations = {
  error: {
    experiments,
    experimentsFilters,
    experimentsSearchDescription,
    experimentsError: {
      status: 0,
      statusText: 'Request timeout',
      errors: {},
      name: 'JsonApiError',
      message: '0 - Request timeout',
    },
  },
  empty: {
    experiments,
    experimentsFilters,
    experimentsSearchDescription,
  },
  pending: {
    experiments,
    experimentsFilters,
    experimentsSearchDescription,
    experimentsIsPending: true,
  },
};

storiesOf('Experiments', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .addDecorator(story => <ConnectedStorybook story={story()} />)
  .add('Empty', () => <Experiments {...variations.empty} />)
  .add('Pending', () => <Experiments {...variations.pending} />)
  .add('Error', () => <Experiments {...variations.error} />);
