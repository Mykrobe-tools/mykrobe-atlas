/* @flow */

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import store, { history } from './store/store'; // eslint-disable-line import/default
import './app.global.css';
import './styles/main.css';

// import used moment locales individually, otherwise excluded by webpack config
import moment from 'moment';
require('moment/locale/en-gb');

// set the default locale, primarily for correct date formatting
try {
  const locale = window.navigator.language;
  moment.locale(locale.toLowerCase());
} catch (e) {
  console.error(e);
}

let element = document.getElementById('app-root');

if (!element) {
  throw new Error(`Fatal - div with id 'app-root' not found`);
}

const renderRoot = () => {
  const routes = require('./routes');
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
