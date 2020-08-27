/* @flow */

import * as Sentry from '@sentry/react';

import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const onError = (error: Error, errorInfo: any) => {
  Sentry.withScope((scope) => {
    scope.setExtras(errorInfo);
    Sentry.captureException(error);
  });
};

export const sagaMiddleware = createSagaMiddleware({ onError });
