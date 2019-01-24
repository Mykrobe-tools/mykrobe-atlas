/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import AnimatedBackgroundCanvas from './AnimatedBackgroundCanvas';

const variations = {
  default: {},
};

storiesOf('AnimatedBackgroundCanvas', module).add('Default', () => (
  <AnimatedBackgroundCanvas {...variations.default} />
));
