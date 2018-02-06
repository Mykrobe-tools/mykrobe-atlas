/* @flow */

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import routes from './routes';
import store, { history } from './store/store'; // eslint-disable-line import/default
import './app.global.css';
import './css/main.css';

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>{routes}</ConnectedRouter>
  </Provider>,
  document.getElementById('app-root')
);

if (module.hot) {
  module.hot.accept('./routes', () => {
    const routes = require('./routes');
    render(
      <Provider store={store}>
        <ConnectedRouter history={history}>{routes}</ConnectedRouter>
      </Provider>,
      document.getElementById('app-root')
    );
  });
}
