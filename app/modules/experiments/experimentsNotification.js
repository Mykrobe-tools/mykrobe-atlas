/* @flow */

import { channel } from 'redux-saga';
import { all, fork, put, take, takeEvery, select } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { push } from 'connected-react-router';
import moment from 'moment';
import _get from 'lodash.get';
import _isEqual from 'lodash.isequal';

import { queryStringKeyExtractor } from 'makeandship-js-common/src/modules/generic/keyExtractors';

import {
  showNotification,
  updateNotification,
  hideNotification,
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

// use the query to identify each notification
// strip the 'search_id' provided in server sent events

export const notificationIdForBigsi = bigsi => {
  const { search_id, ...rest } = bigsi;
  const notificationId = queryStringKeyExtractor(rest);
  return notificationId;
};

// in progress

function* pendingSearchWatcher() {
  yield takeEvery(experimentsActionTypes.REQUEST_SUCCESS, function*() {
    const isPending = yield select(getExperimentsIsPending);
    if (isPending) {
      const currentBigsi = yield select(getBigsi);
      const notificationId = notificationIdForBigsi(currentBigsi);
      // TODO: summarise search query in the content
      yield put(
        showNotification({
          id: notificationId,
          category: NotificationCategories.MESSAGE,
          content: `Search in progress`,
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
      // TODO: summarise search query in the content
      yield put(
        showNotification({
          id: notificationId,
          category: NotificationCategories.MESSAGE,
          content: `Search in progress`,
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
      // TODO: summarise search query in the content
      // TODO: add action to view the results
      yield put(
        updateNotification(notificationId, {
          category: NotificationCategories.MESSAGE,
          content: `Search complete`,
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
