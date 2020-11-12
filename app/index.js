/* @flow */

import * as React from 'react';
import { render } from 'react-dom';

import Root from './components/root/Root';

import './styles/app.scss';

console.log('window.env', JSON.stringify(window.env));
console.log('process.env.NODE_ENV', JSON.stringify(process.env.NODE_ENV));
console.log(
  'process.env.DEBUG_PRODUCTION',
  JSON.stringify(process.env.DEBUG_PRODUCTION)
);

let element = document.getElementById('app-root');

if (!element) {
  throw new Error(`Fatal - div with id 'app-root' not found`);
}

const renderRoot = () => {
  render(<Root />, element);
};

renderRoot();

if (module.hot) {
  module.hot.accept('./modules', () => {
    renderRoot();
  });
}
