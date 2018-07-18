/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ConnectedStorybook from '../../util/ConnectedStorybook';

import NotificationsContainer from './NotificationsContainer';

import {
  showNotification,
  NotificationCategories,
} from '../../modules/notifications';

import store from '../../store';

store.dispatch(
  showNotification(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultrices, leo vel hendrerit hendrerit, tellus nisi porttitor ipsum, a iaculis nibh orci et libero'
  )
);

store.dispatch(
  showNotification({
    category: NotificationCategories.ERROR,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultrices, leo vel hendrerit hendrerit, tellus nisi porttitor ipsum, a iaculis nibh orci et libero',
  })
);

store.dispatch(
  showNotification({
    category: NotificationCategories.MESSAGE,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultrices, leo vel hendrerit hendrerit, tellus nisi porttitor ipsum, a iaculis nibh orci et libero',
  })
);

storiesOf('NotificationsContainer', module)
  .addDecorator(story => <ConnectedStorybook story={story()} />)
  .add('Default', () => <NotificationsContainer />)
  .add('Hide dismissed', () => <NotificationsContainer hideDismissed />);
