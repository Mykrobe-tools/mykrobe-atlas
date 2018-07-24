/* @flow */

import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { storiesOf } from '@storybook/react';

import ConnectedStorybook from '../../util/ConnectedStorybook';

import EditMetadata from './EditMetadata';
import { requestExperiment } from '../../modules/experiments';

import store from '../../store';

// TODO: generic flag to override form 'readonly' status

store.dispatch(requestExperiment('5b55e8c0c23a300010bac216'));

storiesOf('EditMetadata', module)
  .addDecorator(story => (
    <MemoryRouter
      initialEntries={[
        '/experiments/5b55e8c0c23a300010bac216/metadata/patient',
      ]}
    >
      {story()}
    </MemoryRouter>
  ))
  .addDecorator(story => <ConnectedStorybook story={story()} />)
  .add('Default', () => <EditMetadata />);
