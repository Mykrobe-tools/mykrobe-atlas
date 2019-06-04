/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import ExperimentGeographicMap from './ExperimentGeographicMap';

const setNodeHighlighted = (id, highlighted) => {
  console.log('setNodeHighlighted', id, highlighted);
};

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
  id: '1',
};

const experiment2 = {
  metadata: {
    sample: {
      isolateId: 'SAMD00029386',
      countryIsolate: 'JP',
      cityIsolate: 'Tochigi',
      longitudeIsolate: 139.7341435,
      latitudeIsolate: 36.3824655,
    },
  },
  id: '2',
};

const experiment3 = {
  metadata: {
    sample: {
      isolateId: 'SAMEA104447473',
      countryIsolate: 'DK',
      cityIsolate: '',
      longitudeIsolate: 10.3333283,
      latitudeIsolate: 55.670249,
    },
  },
  id: '3',
};

const variations = {
  default: {
    setNodeHighlighted,
    experiments: [experiment],
    highlighted: [experiment.id],
  },
  cluster: {
    setNodeHighlighted,
    experiments: [experiment, experiment2, experiment3],
    highlighted: [experiment3.id],
  },
};

storiesOf('ExperimentGeographicMap', module)
  .add('Default', () => (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ExperimentGeographicMap {...variations.default} />
    </div>
  ))
  .add('Cluster', () => (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ExperimentGeographicMap {...variations.cluster} />
    </div>
  ));
