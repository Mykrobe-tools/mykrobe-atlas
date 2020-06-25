/* @flow */

import { all, fork } from 'redux-saga/effects';

import { experimentNavigationSaga } from './experimentNavigation';
import { organisationNavigationSaga } from './organisationNavigation';
import { currentUserNavigationSaga } from './currentUserNavigation';

export function* rootNavigationSaga(): Generator<*, *, *> {
  yield all([
    fork(experimentNavigationSaga),
    fork(organisationNavigationSaga),
    fork(currentUserNavigationSaga),
  ]);
}
