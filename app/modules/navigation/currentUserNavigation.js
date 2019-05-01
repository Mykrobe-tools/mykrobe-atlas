/* @flow */

import { all, fork, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { currentUserActionTypes } from '../users/currentUser';

// Side effects

function* createWatcher() {
  yield takeLatest(currentUserActionTypes.CREATE_SUCCESS, createWorker);
}

export function* createWorker(): Generator<*, *, *> {
  yield put(push('/auth/signupsuccess'));
}

export function* currentUserNavigationSaga(): Generator<*, *, *> {
  yield all([fork(createWatcher)]);
}
