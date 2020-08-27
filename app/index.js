/* @flow */

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import store from './store';
import { history } from './store/config';

import './styles/app.scss';

console.log('window.env', JSON.stringify(window.env));
console.log('process.env.NODE_ENV', JSON.stringify(process.env.NODE_ENV));
console.log(
  'process.env.DEBUG_PRODUCTION',
  JSON.stringify(process.env.DEBUG_PRODUCTION)
);

let element = document.getElementById('app-root');

if (!element) {
  throw new Error(`Fatal - div with id 'app-root' not found`);
}

const renderRoot = () => {
  const routes = require('./routes').default;
  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>{routes}</ConnectedRouter>
    </Provider>,
    element
  );
};

renderRoot();

if (module.hot) {
  module.hot.accept('./routes', () => {
    renderRoot();
  });
}
