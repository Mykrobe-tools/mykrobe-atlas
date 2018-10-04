/* @flow */

import { all, fork } from 'redux-saga/effects';

import { experimentNavigationSaga } from './experimentNavigation';
import { currentUserNavigationSaga } from './currentUserNavigation';

export function* rootNavigationSaga(): Generator<*, *, *> {
  yield all([fork(experimentNavigationSaga), fork(currentUserNavigationSaga)]);
}
