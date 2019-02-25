/* @flow */

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import store, { history } from './store';
import './styles/app.global.scss';

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

console.log('process.env.NODE_ENV', JSON.stringify(process.env.NODE_ENV));
console.log(
  'process.env.DEBUG_PRODUCTION',
  JSON.stringify(process.env.DEBUG_PRODUCTION)
);
console.log(
  'process.env.DISABLE_DESKTOP_UPDATER',
  JSON.stringify(process.env.DISABLE_DESKTOP_UPDATER)
);
console.log(
  'process.env.DISABLE_DESKTOP_BACKGROUND_ANIMATION',
  JSON.stringify(process.env.DISABLE_DESKTOP_BACKGROUND_ANIMATION)
);
console.log('process.env.API_DEBUG', JSON.stringify(process.env.API_DEBUG));
console.log('process.env.API_URL', JSON.stringify(process.env.API_URL));
console.log(
  'process.env.API_SWAGGER_URL',
  JSON.stringify(process.env.API_SWAGGER_URL)
);
console.log(
  'process.env.AUTH_COOKIE_NAME',
  JSON.stringify(process.env.AUTH_COOKIE_NAME)
);

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
