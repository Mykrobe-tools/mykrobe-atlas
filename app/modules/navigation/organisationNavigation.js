/* @flow */

import { all, fork, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { NEW_ENTITY_KEY } from 'makeandship-js-common/src/modules/generic';

import { organisationActionTypes } from '../organisations/organisation';

// Side effects

function* newWatcher() {
  yield takeLatest(organisationActionTypes.NEW, newWorker);
}

export function* newWorker(): Generator<*, *, *> {
  yield put(push(`/organisations/${NEW_ENTITY_KEY}`));
}

function* createWatcher() {
  yield takeLatest(organisationActionTypes.CREATE_SUCCESS, createWorker);
}

export function* createWorker(action: any): Generator<*, *, *> {
  const entity = action.payload;
  const { id } = entity;
  yield put(push(`/organisations/${id}`));
}

function* updateWatcher() {
  yield takeLatest(organisationActionTypes.UPDATE_SUCCESS, updateWorker);
}

export function* updateWorker(action: any): Generator<*, *, *> {
  const entity = action.payload;
  const { id } = entity;
  yield put(push(`/organisations/${id}`));
}

function* deleteWatcher() {
  yield takeLatest(organisationActionTypes.DELETE_SUCCESS, deleteWorker);
}

export function* deleteWorker(): Generator<*, *, *> {
  yield put(push('/organisations'));
}

export function* organisationNavigationSaga(): Generator<*, *, *> {
  yield all([
    fork(newWatcher),
    fork(createWatcher),
    fork(updateWatcher),
    fork(deleteWatcher),
  ]);
}
