/* @flow */

// Differences from web:
// * Do not use Sentry
// * Use hash router since Electron is using file:// protocol

import createSagaMiddleware from 'redux-saga';
import { createHashHistory } from 'history';

export const history = createHashHistory();

export const sagaMiddleware = createSagaMiddleware();
