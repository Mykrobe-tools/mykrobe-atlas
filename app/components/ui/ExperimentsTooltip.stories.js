/* @flow */

import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { storiesOf } from '@storybook/react';

import ExperimentsTooltip from './ExperimentsTooltip';

const experiment = {
  metadata: {
    sample: {
      isolateId: 'SAMD00029386',
      countryIsolate: 'JP',
      cityIsolate: 'Tochigi',
      longitudeIsolate: 139.7341435,
      latitudeIsolate: 36.3824655,
    },
  },
  results: {},
  created: '2019-05-23T08:44:01.886Z',
  modified: '2019-05-23T08:44:01.886Z',
  id: '5ce65d4ed45837000fde7051',
  relevance: 1,
};

const variations = {
  default: {
    experiments: [experiment],
    x: '50%',
    y: '50%',
  },
};

storiesOf('ui/ExperimentsTooltip', module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('Default', () => <ExperimentsTooltip {...variations.default} />);
