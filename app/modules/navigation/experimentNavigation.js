/* @flow */

import { all, fork, put, takeLatest, select } from 'redux-saga/effects';
import { push, getLocation } from 'connected-react-router';

import { NEW_ENTITY_KEY } from 'makeandship-js-common/src/modules/generic';

import { experimentActionTypes } from '../experiments/experiment';
import { requestExperiments } from '../experiments';

// Side effects

function* newWatcher() {
  yield takeLatest(experimentActionTypes.NEW, newWorker);
}

export function* newWorker(): Generator<*, *, *> {
  yield put(push(`/experiments/${NEW_ENTITY_KEY}`));
}

function* createWatcher() {
  yield takeLatest(experimentActionTypes.CREATE_SUCCESS, createWorker);
}

export function* createWorker(action: any): Generator<*, *, *> {
  const entity = action.payload;
  const { id } = entity;
  yield put(push(`/experiments/${id}`));
}

// TODO: remove if expected user behaviour is to stay on current experiement tab when updating experiment

// function* updateWatcher() {
//   yield takeLatest(experimentActionTypes.UPDATE_SUCCESS, updateWorker);
// }

// export function* updateWorker(action: any): Generator<*, *, *> {
//   const entity = action.payload;
//   const { id } = entity;
//   yield put(push(`/experiments/${id}`));
// }

function* deleteWatcher() {
  yield takeLatest(experimentActionTypes.DELETE_SUCCESS, deleteWorker);
}

export function* deleteWorker(): Generator<*, *, *> {
  const { pathname } = yield select(getLocation);
  if (pathname === '/experiments') {
    yield put(requestExperiments());
  } else {
    yield put(push('/experiments?sort=modified&order=desc'));
  }
}

export function* experimentNavigationSaga(): Generator<*, *, *> {
  yield all([
    fork(newWatcher),
    fork(createWatcher),
    // fork(updateWatcher),
    fork(deleteWatcher),
  ]);
}
