/* @flow */

import { all, fork, put, takeEvery, select } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import _get from 'lodash.get';
import _isEqual from 'lodash.isequal';

import {
  showNotification,
  updateNotification,
  NotificationCategories,
} from '../notifications';

import {
  PROTEIN_VARIANT_SEARCH_STARTED,
  PROTEIN_VARIANT_SEARCH_COMPLETE,
  SEQUENCE_SEARCH_STARTED,
  SEQUENCE_SEARCH_COMPLETE,
} from '../users/currentUserEvents';

import {
  getExperimentsIsPending,
  getBigsi,
  requestExperiments,
  experimentsActionTypes,
} from './experiments';

import { notificationIdForBigsi, descriptionForBigsi } from './util/bigsi';

// in progress

function* pendingSearchWatcher() {
  yield takeEvery(experimentsActionTypes.REQUEST_SUCCESS, function*() {
    const isPending = yield select(getExperimentsIsPending);
    if (isPending) {
      const currentBigsi = yield select(getBigsi);
      const notificationId = notificationIdForBigsi(currentBigsi);
      const description = descriptionForBigsi(currentBigsi);
      yield put(
        showNotification({
          id: notificationId,
          category: NotificationCategories.MESSAGE,
          content: `${description} in progress`,
          autoHide: false,
          progress: 0,
        })
      );
    }
  });
}

// started

function* searchStartedWatcher() {
  yield takeEvery(
    [PROTEIN_VARIANT_SEARCH_STARTED, SEQUENCE_SEARCH_STARTED],
    function*(action) {
      // refresh if this matches the current search
      const startedBigsi = _get(action.payload, 'search.bigsi');
      const notificationId = notificationIdForBigsi(startedBigsi);
      const description = descriptionForBigsi(startedBigsi);
      yield put(
        showNotification({
          id: notificationId,
          category: NotificationCategories.MESSAGE,
          content: `${description} in progress`,
          autoHide: false,
          progress: 0,
        })
      );
    }
  );
}

// complete

function* searchCompleteWatcher() {
  yield takeEvery(
    [PROTEIN_VARIANT_SEARCH_COMPLETE, SEQUENCE_SEARCH_COMPLETE],
    function*(action) {
      // refresh if this matches the current search
      const completeBigsi = _get(action.payload, 'search.bigsi');
      const currentBigsi = yield select(getBigsi);
      if (_isEqual(completeBigsi, currentBigsi)) {
        yield put(requestExperiments());
      }
      const notificationId = notificationIdForBigsi(completeBigsi);
      const description = descriptionForBigsi(completeBigsi);
      // TODO: add action to view the results
      yield put(
        updateNotification(notificationId, {
          category: NotificationCategories.SUCCESS,
          content: `${description} complete`,
          autoHide: true,
          progress: undefined,
        })
      );
    }
  );
}

export function* experimentsNotificationSaga(): Saga {
  yield all([
    fork(pendingSearchWatcher),
    fork(searchStartedWatcher),
    fork(searchCompleteWatcher),
  ]);
}
