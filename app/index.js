/* @flow */

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory, createHashHistory } from 'history';

import { ConnectedRouter } from 'react-router-redux';

import routes from './routes';
import store, { history } from './store/store'; // eslint-disable-line import/default
import './app.global.css';
import './css/main.css';

// const history = IS_ELECTRON ? createHashHistory() : createBrowserHistory();

console.log('Provider', Provider);
console.log('ConnectedRouter', ConnectedRouter);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>{routes}</ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./routes', () => {
    const routes = require('./routes');
    render(
      <Provider store={store}>
        <ConnectedRouter history={history}>{routes}</ConnectedRouter>
      </Provider>,
      document.getElementById('root')
    );
  });
}
