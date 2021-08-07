/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import TabNavigation, { TabNavigationLink } from './TabNavigation';

storiesOf('ui/TabNavigation', module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/lorem']}>{story()}</MemoryRouter>
  ))
  .add('Default', () => (
    <TabNavigation>
      <TabNavigationLink to="/lorem">Lorem</TabNavigationLink>
      <TabNavigationLink to="/ipsum">Ipsum</TabNavigationLink>
      <TabNavigationLink to="/dolor">Dolor</TabNavigationLink>
    </TabNavigation>
  ));
