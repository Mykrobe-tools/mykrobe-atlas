/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import FillContainerStorybook from '../../../util/storybook/FillContainerStorybook';

import DragAndDrop from './DragAndDrop';

const onDrop = (e) => console.log('onDrop', e);

const variations = {
  default: {
    onDrop,
  },
  disabled: {
    onDrop,
    enabled: false,
  },
  jsonOnly: {
    onDrop,
    accept: ['.json'],
  },
};

storiesOf('DragAndDrop', module)
  .addDecorator((story) => <FillContainerStorybook story={story()} />)
  .add('Default', () => <DragAndDrop {...variations.default} />)
  .add('Disabled', () => <DragAndDrop {...variations.disabled} />)
  .add('JSON only', () => <DragAndDrop {...variations.jsonOnly} />);
