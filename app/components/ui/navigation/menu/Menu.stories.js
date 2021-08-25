/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import FillContainerStorybook from '../../../../util/storybook/FillContainerStorybook';
import Menu from './Menu';

storiesOf('ui/Menu', module)
  .addDecorator((story) => <FillContainerStorybook story={story()} />)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/lorem']}>{story()}</MemoryRouter>
  ))
  .add('Hidden', () => <Menu />)
  .add('Visible', () => <Menu displayMenu />);
