/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import Menu from './Menu';

storiesOf('ui/Menu', module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/lorem']}>{story()}</MemoryRouter>
  ))
  .add('Hidden', () => <Menu />)
  .add('Visible', () => <Menu displayMenu />);
