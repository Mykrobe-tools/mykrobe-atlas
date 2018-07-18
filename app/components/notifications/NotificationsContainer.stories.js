/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ConnectedStorybook from '../../util/ConnectedStorybook';

import NotificationsContainer from './NotificationsContainer';
import NotificationsStyle from './NotificationsStyle';

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
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  })
);

store.dispatch(
  showNotification({
    category: NotificationCategories.MESSAGE,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultrices',
    progress: 75,
  })
);

storiesOf('NotificationsContainer', module)
  .addDecorator(story => <ConnectedStorybook story={story()} />)
  .add('Default', () => (
    <div style={{ backgroundColor: 'grey' }}>
      <NotificationsContainer />
    </div>
  ))
  .add('Separate', () => (
    <div style={{ backgroundColor: 'grey' }}>
      <NotificationsContainer
        notificationsStyle={NotificationsStyle.SEPARATE}
      />
    </div>
  ))
  .add('Joined', () => (
    <div style={{ backgroundColor: 'grey' }}>
      <NotificationsContainer notificationsStyle={NotificationsStyle.JOINED} />
    </div>
  ))
  .add('Joined desc limited', () => (
    <div style={{ backgroundColor: 'grey' }}>
      <NotificationsContainer
        notificationsStyle={NotificationsStyle.JOINED}
        order={'desc'}
        limit={5}
      />
    </div>
  ))
  .add('Hide dismissed', () => <NotificationsContainer hideDismissed />);
