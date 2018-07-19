/* @flow */

import { channel } from 'redux-saga';
import {
  all,
  fork,
  put,
  take,
  race,
  takeEvery,
  select,
  call,
  apply,
} from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { push } from 'react-router-redux';

import {
  INITIALISE_SUCCESS,
  SET_TOKEN,
  CHECK_TOKEN_SUCCESS,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAIL,
  getAccessToken,
  checkToken,
} from 'makeandship-js-common/src/modules/auth/auth';

import {
  showNotification,
  updateNotification,
  NotificationCategories,
} from '../notifications';

import * as APIConstants from '../../constants/APIConstants';
import {
  createExperimentId,
  deleteExperiment,
} from '../experiments/experiment';

import ResumableUpload, {
  RESUMABLE_UPLOAD_FILE_ADDED,
  RESUMABLE_UPLOAD_PROGRESS,
  RESUMABLE_UPLOAD_ERROR,
  RESUMABLE_UPLOAD_DONE,
} from './util/ResumableUpload';

import ComputeChecksums, {
  COMPUTE_CHECKSUMS_PROGRESS,
  COMPUTE_CHECKSUMS_COMPLETE,
} from './util/ComputeChecksums';

import {
  SET_FILE_NAME,
  UPLOAD_FILE_CANCEL_SUCCESS,
  getExperimentId,
  getFileName,
  getProgress,
} from './uploadFile';

// file added

function* fileAddedWatcher() {
  yield takeEvery(SET_FILE_NAME, function*() {
    const experimentId = yield select(getExperimentId);
    const fileName = yield select(getFileName);
    yield put(
      showNotification({
        id: experimentId,
        category: NotificationCategories.MESSAGE,
        content: `Added ${fileName}`,
        progress: 0,
        autoHide: false,
      })
    );
  });
}

// checksumming

function* computeChecksumsProgressWatcher() {
  yield takeEvery(COMPUTE_CHECKSUMS_PROGRESS, function*() {
    const experimentId = yield select(getExperimentId);
    const fileName = yield select(getFileName);
    const progress = yield select(getProgress);
    yield put(
      updateNotification(experimentId, {
        category: NotificationCategories.MESSAGE,
        content: `Calculating checksums for ${fileName}`,
        progress,
      })
    );
  });
}

// upload events

function* resumableUploadDoneWatcher() {
  yield takeEvery(RESUMABLE_UPLOAD_DONE, function*() {
    yield put(showNotification('Upload complete'));
  });
}

function* resumableUploadErrorWatcher() {
  yield takeEvery(RESUMABLE_UPLOAD_ERROR, function*(action: any) {
    yield put(
      showNotification({
        category: NotificationCategories.ERROR,
        content: action.payload,
      })
    );
  });
}

function* uploadFileCancelWatcher() {
  yield takeEvery(UPLOAD_FILE_CANCEL_SUCCESS, function*() {
    yield put(showNotification('Upload cancelled'));
  });
}

export function* uploadFileNotificationSaga(): Generator<*, *, *> {
  yield all([
    fork(fileAddedWatcher),
    fork(computeChecksumsProgressWatcher),
    fork(resumableUploadDoneWatcher),
    fork(resumableUploadErrorWatcher),
    fork(uploadFileCancelWatcher),
  ]);
}
