/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import ConnectedStorybook from '../../../util/storybook/ConnectedStorybook';

import Header from './Header';

const variations = {
  default: {
    title: 'Lorem ipsum dolor',
  },
  currentUser: {
    title: 'Lorem ipsum dolor',
    currentUser: {
      firstname: 'Lorem',
      lastname: 'Ipsum',
      email: 'lorem@ipsum.com',
    },
  },
};

storiesOf('Header', module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/lorem']}>{story()}</MemoryRouter>
  ))
  .addDecorator((story) => <ConnectedStorybook story={story()} />)
  .add('Default', () => <Header {...variations.default} />)
  .add('User', () => <Header {...variations.currentUser} />);
