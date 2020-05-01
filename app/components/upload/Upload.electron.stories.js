/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import FillContainerStorybook from '../../util/storybook/FillContainerStorybook';

import Upload from './Upload.electron';

storiesOf('Upload.electron', module)
  .addDecorator((story) => <FillContainerStorybook story={story()} />)
  .add('20%', () => <Upload isAnalysing progress={20} />)
  .add('40%', () => <Upload isAnalysing progress={40} />)
  .add('60%', () => <Upload isAnalysing progress={60} />)
  .add('80%', () => <Upload isAnalysing progress={80} />)
  .add('100%', () => <Upload isAnalysing progress={100} />);
