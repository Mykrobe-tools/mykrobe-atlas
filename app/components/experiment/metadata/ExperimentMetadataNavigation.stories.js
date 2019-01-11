/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import ExperimentMetadataNavigation from './ExperimentMetadataNavigation';

const variations = {
  default: {
    completion: {
      complete: 7,
      total: 10,
    },
    match: {
      url: '/',
    },
    experimentOwnerIsCurrentUser: true,
  },
};

storiesOf('ExperimentMetadataNavigation', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('Default', () => (
    <ExperimentMetadataNavigation {...variations.default} />
  ));
