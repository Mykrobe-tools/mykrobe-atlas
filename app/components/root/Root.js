/* @flow */

import * as React from 'react';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/react';
import { ConnectedRouter } from 'connected-react-router';

import store from '../../store';
import { history } from '../../store/config';

import App from '../app/App';

const routes = require('./routes').default;

const USE_SENTRY =
  process.env.NODE_ENV !== 'development' &&
  window.env?.REACT_APP_SENTRY_PUBLIC_DSN;

if (USE_SENTRY) {
  Sentry.init({
    dsn: window.env.REACT_APP_SENTRY_PUBLIC_DSN,
  });
}

const Root = (): React.Element<*> => {
  return (
    <Sentry.ErrorBoundary fallback={'An error has occured'} showDialog>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App>{routes}</App>
        </ConnectedRouter>
      </Provider>
    </Sentry.ErrorBoundary>
  );
};

export default Root;
