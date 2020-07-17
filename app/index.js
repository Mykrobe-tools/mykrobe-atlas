/* @flow */

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import store, { history } from './store';

import './styles/app.scss';

let element = document.getElementById('app-root');

if (!element) {
  throw new Error(`Fatal - div with id 'app-root' not found`);
}

console.log('process.env.NODE_ENV', JSON.stringify(process.env.NODE_ENV));
console.log(
  'process.env.DEBUG_PRODUCTION',
  JSON.stringify(process.env.DEBUG_PRODUCTION)
);

console.log('window.env', JSON.stringify(window.env));

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
