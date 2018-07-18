/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ConnectedStorybook from '../../util/ConnectedStorybook';

import NotificationsContainer from './NotificationsContainer';

import {
  getNotifications,
  showNotification,
  setNotificationExpanded,
  dismissAllNotifications,
  dismissNotification,
} from '../../modules/notifications';

import store from '../../store';

store.dispatch(showNotification('Hello!'));

storiesOf('NotificationsContainer', module)
  .addDecorator(story => <ConnectedStorybook story={story()} />)
  .add('Default', () => <NotificationsContainer />)
  .add('Hide dismissed', () => <NotificationsContainer hideDismissed />);
