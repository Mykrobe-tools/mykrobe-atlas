/* @flow */

import { all, fork } from 'redux-saga/effects';

import browserAuthNavigationSaga from 'makeandship-js-common/src/modules/auth/browserNavigation';

import { experimentNavigationSaga } from './experimentNavigation';
import { currentUserNavigationSaga } from './currentUserNavigation';

export function* rootNavigationSaga(): Generator<*, *, *> {
  yield all([
    fork(browserAuthNavigationSaga),
    fork(experimentNavigationSaga),
    fork(currentUserNavigationSaga),
  ]);
}
