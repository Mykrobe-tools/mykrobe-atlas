/* @flow */

import { channel } from 'redux-saga';
import { all, fork, put, takeEvery, select, take } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import _get from 'lodash.get';
import { push } from 'connected-react-router';
import qs from 'qs';

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
  DISTANCE_SEARCH_COMPLETE,
} from '../users/currentUserEvents';

import {
  getExperiment,
  getExperimentDistanceIsSearching,
  requestExperiment,
} from './experiment';

import {
  getExperimentsIsPending,
  getBigsi,
  getSearchId,
  requestExperiments,
  experimentsActionTypes,
} from './experiments';

import { descriptionForBigsi } from './util/bigsi';

const _interactionChannel = channel();

export function* interactionChannelWatcher(): Saga {
  while (true) {
    const action = yield take(_interactionChannel);
    yield put(action);
  }
}

// in progress

function* pendingSearchWatcher() {
  yield takeEvery(experimentsActionTypes.REQUEST_SUCCESS, function* () {
    const isPending = yield select(getExperimentsIsPending);
    if (isPending) {
      const currentBigsi = yield select(getBigsi);
      const searchId = yield select(getSearchId);
      const notificationId = searchId;
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
    function* (action) {
      // refresh if this matches the current search
      const startedBigsi = _get(action.payload, 'search.bigsi');
      const startedSearchId = _get(action.payload, 'id');
      const notificationId = startedSearchId;
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
    function* (action) {
      // refresh if this matches the current search
      const completeBigsi = _get(action.payload, 'search.bigsi');
      const completeSearchId = _get(action.payload, 'id');
      const completeQuery = _get(action.payload, 'search.query');
      const currentSearchId = yield select(getSearchId);
      const isViewingCompleteSearch = currentSearchId === completeSearchId;
      if (isViewingCompleteSearch) {
        yield put(requestExperiments());
      }
      const notificationId = completeSearchId;
      const description = descriptionForBigsi(completeBigsi);
      yield put(
        updateNotification(notificationId, {
          category: NotificationCategories.SUCCESS,
          content: `${description} complete`,
          autoHide: isViewingCompleteSearch,
          progress: undefined,
          actions: [
            {
              title: 'View results',
              onClick: () => {
                const stringifiedQuery = qs.stringify(completeQuery);
                _interactionChannel.put(
                  push(`/experiments?${stringifiedQuery}`)
                );
              },
            },
          ],
        })
      );
    }
  );
}

function* distanceSearchCompleteWatcher() {
  yield takeEvery(DISTANCE_SEARCH_COMPLETE, function* (action) {
    // refresh if this matches the current experiment
    const completeExperimentId = _get(action.payload, 'id');
    const currentExperiment = yield select(getExperiment);
    const currentExperimentId = _get(currentExperiment, 'id');
    const isViewingCompleteExperiment =
      currentExperimentId === completeExperimentId;
    const experimentDistanceIsSearching = yield select(
      getExperimentDistanceIsSearching
    );
    if (isViewingCompleteExperiment && experimentDistanceIsSearching) {
      yield put(requestExperiment(completeExperimentId));
      yield put(showNotification(`Distance search complete`));
    }
  });
}

export function* experimentsNotificationSaga(): Saga {
  yield all([
    fork(interactionChannelWatcher),
    fork(pendingSearchWatcher),
    fork(searchStartedWatcher),
    fork(searchCompleteWatcher),
    fork(distanceSearchCompleteWatcher),
  ]);
}
