import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './app.global.css';

const platform = require('os').platform();
console.log('platform', platform);

console.log('process.cwd():', process.cwd());

const spawn = require('child_process').spawn;

const child = spawn('ls', ['-la']);
child.stdout.on("data", (data) => {
  const dataString = data.toString('utf8');
  console.log(dataString);
  // console.log('data', data);
});

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
