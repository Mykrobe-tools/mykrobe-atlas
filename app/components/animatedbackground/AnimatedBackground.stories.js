/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import AnimatedBackground from './AnimatedBackground';

const variations = {
  default: {},
};

storiesOf('AnimatedBackground', module).add('Default', () => (
  <AnimatedBackground {...variations.default} />
));
