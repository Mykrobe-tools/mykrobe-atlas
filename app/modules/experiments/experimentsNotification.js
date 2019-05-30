/* @flow */

import { channel } from 'redux-saga';
import { all, fork, put, take, takeEvery, select } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { push } from 'connected-react-router';
import moment from 'moment';
import produce from 'immer';
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

export const notificationIdForBigsi = bigsi => {
  const cleaned = produce(bigsi, draft => {
    // strip the 'search_id' provided in server sent events
    delete draft.search_id;
    // strip the 'threshold' which seems to change for the same query
    draft.query.threshold && delete draft.query.threshold;
  });
  const notificationId = queryStringKeyExtractor(cleaned);
  return notificationId;
};

export const mapTypeToSearch = {
  sequence: 'Sequence search',
  'protein-variant': 'Protein variant search',
  'dna-variant': 'DNA variant search',
};

export const descriptionForBigsi = bigsi => {
  const query = _get(bigsi, 'query.seq');
  const type = _get(bigsi, 'type');
  const search = mapTypeToSearch[type] || 'Search';
  return query ? `${search} for ${query}` : search;
};

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
