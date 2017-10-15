/* @flow */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import store from './store/store'; // eslint-disable-line import/default
import './app.global.css';
import './css/main.css';

import AnalyserLocalFile from './services/analyser/AnalyserLocalFile';
import MykrobeConfig from './services/MykrobeConfig';

const analyser = new AnalyserLocalFile(new MykrobeConfig());
console.log(analyser.dirToBin());

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
