/* @flow */

import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import store from '../../store';
import { history } from '../../store/config';

import App from '../app/App';

const routes = require('./routes').default;

const Root = (): React.Element<*> => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App>{routes}</App>
      </ConnectedRouter>
    </Provider>
  );
};

export default Root;
