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
    autoDismiss: false,
  })
);

store.dispatch(
  showNotification({
    category: NotificationCategories.MESSAGE,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultrices',
    progress: 75,
    autoDismiss: false,
  })
);

storiesOf('NotificationsContainer', module)
  .addDecorator(story => <ConnectedStorybook story={story()} />)
  .addDecorator(story => (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '80%',
        padding: '10px',
        background: 'linear-gradient(white, #ccc)',
      }}
    >
      {story()}
    </div>
  ))
  .add('Default', () => <NotificationsContainer />)
  .add('Separate', () => (
    <NotificationsContainer notificationsStyle={NotificationsStyle.SEPARATE} />
  ))
  .add('Joined', () => (
    <NotificationsContainer notificationsStyle={NotificationsStyle.JOINED} />
  ))
  .add('Joined desc limited', () => (
    <NotificationsContainer
      notificationsStyle={NotificationsStyle.JOINED}
      order={'desc'}
      limit={5}
    />
  ))
  .add('Hide dismissed', () => (
    <NotificationsContainer
      notificationsStyle={NotificationsStyle.SEPARATE}
      hideDismissed
    />
  ));
