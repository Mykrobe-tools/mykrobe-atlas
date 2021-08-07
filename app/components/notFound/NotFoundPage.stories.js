/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import ConnectedStorybook from '../../util/storybook/ConnectedStorybook';

import NotFoundPage from './NotFoundPage';

const variations = {
  default: {},
};

storiesOf('NotFound/NotFoundPage', module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .addDecorator((story) => <ConnectedStorybook story={story()} />)
  .add('NotFoundPage', () => <NotFoundPage {...variations.default} />);
