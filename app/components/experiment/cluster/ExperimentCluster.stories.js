/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import FillContainerStorybook from '../../../util/storybook/FillContainerStorybook';
import ExperimentCluster from './ExperimentCluster';

const setExperimentsHighlighted = (experiments) => {
  console.log('setExperimentsHighlighted', experiments);
};

const resetExperimentsHighlighted = () => {
  console.log('resetExperimentsHighlighted');
};

import experiment from './fixtures/experiment.json';

const variations = {
  default: {
    experiment,
    experimentCluster: experiment.results.cluster,
    experimentClusterIsSearching: false,
    setExperimentsHighlighted,
    resetExperimentsHighlighted,
    experiments: [experiment],
    experimentsHighlighted: [experiment],
  },
};

storiesOf('Experiment/ExperimentCluster', module)
  .addDecorator((story) => <FillContainerStorybook story={story()} />)
  .add('Default', () => <ExperimentCluster {...variations.default} />);
