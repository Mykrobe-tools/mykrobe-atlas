/* @flow */

import React from 'react';
import { Provider } from 'react-redux';
import store from '../store';

export default ({ story }) => {
  return <Provider store={store}>{story}</Provider>;
};
