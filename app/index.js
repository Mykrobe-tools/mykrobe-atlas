/* @flow */

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import store, { history } from './store';

import './styles/app.scss';

// import used moment locales individually, otherwise excluded by webpack config
import moment from 'moment';
require('moment/locale/en-gb');

// set the default locale, primarily for correct date formatting
try {
  const locale = window.navigator.language;
  locale && moment.locale(locale.toLowerCase());
} catch (e) {
  console.error(e);
}

let element = document.getElementById('app-root');

if (!element) {
  throw new Error(`Fatal - div with id 'app-root' not found`);
}

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
