/* @flow */

import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { storiesOf } from '@storybook/react';

import ConnectedStorybook from '../../util/storybook/ConnectedStorybook';
import FillContainerStorybook from '../../util/storybook/FillContainerStorybook';

import Upload from './Upload';

storiesOf('Upload', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .addDecorator(story => <ConnectedStorybook story={story()} />)
  .addDecorator(story => <FillContainerStorybook story={story()} />)
  .add('Default', () => <Upload />)
  .add('Authenticated', () => <Upload isAuthenticated />);
