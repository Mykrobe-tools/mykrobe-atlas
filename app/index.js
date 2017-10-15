/* @flow */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import store from './store/store';
import './app.global.css';
import './css/main.css';

const history = syncHistoryWithStore(
  IS_ELECTRON ? hashHistory : browserHistory,
  store
);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./routes', () => {
    const routes = require('./routes');
    render(
      <Provider store={store}>
        <Router history={history} routes={routes} />
      </Provider>,
      document.getElementById('root')
    );
  });
}
