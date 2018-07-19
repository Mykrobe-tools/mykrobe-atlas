/* @flow */

import * as React from 'react';
import { Provider } from 'react-redux';

import store from '../store';

export default ({ story }: React.ElementProps<*>): React.Element<*> => (
  <Provider store={store}>{story}</Provider>
);
