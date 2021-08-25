/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import FillContainerStorybook from '../../../util/storybook/FillContainerStorybook';
import AnimatedBackgroundCanvas from './AnimatedBackgroundCanvas';

const variations = {
  default: {},
};

storiesOf('ui/AnimatedBackgroundCanvas', module)
  .addDecorator((story) => <FillContainerStorybook story={story()} />)
  .add('Default', () => <AnimatedBackgroundCanvas {...variations.default} />);
