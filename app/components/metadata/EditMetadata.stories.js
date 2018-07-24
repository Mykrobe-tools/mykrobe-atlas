/* @flow */

import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { storiesOf } from '@storybook/react';

import ConnectedStorybook from '../../util/ConnectedStorybook';

import EditMetadata from './EditMetadata';
import { setExperiment } from '../../modules/experiments';

import store from '../../store';

// TODO: generic flag to override form 'readonly' status

store.dispatch(
  setExperiment({
    owner: {
      id: '5b3f862643adf6000fecaf19',
    },
  })
);

storiesOf('EditMetadata', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .addDecorator(story => <ConnectedStorybook story={story()} />)
  .add('Default', () => <EditMetadata />);
