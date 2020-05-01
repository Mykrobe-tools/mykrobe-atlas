/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import Notifications from './Notifications';

const variations = {
  default: {
    notifications: [
      {
        id: '123',
        category: 'MESSAGE',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultrices, leo vel hendrerit hendrerit, tellus nisi porttitor ipsum, a iaculis nibh orci et libero. ',
        onClose: (id) => {
          console.log('Close', id);
        },
        actions: [
          {
            title: 'View',
            onClick: (id) => {
              console.log('View', id);
            },
          },
          {
            title: 'Cancel',
            onClick: (id) => {
              console.log('Cancel', id);
            },
          },
        ],
        expanded: false,
        setExpanded: (id, expanded) => {
          console.log('setExpanded', id, expanded);
        },
      },
    ],
  },
};

storiesOf('Notifications', module).add('Default', () => (
  <Notifications {...variations.default} />
));
