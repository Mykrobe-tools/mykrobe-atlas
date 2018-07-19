/* @flow */

import { channel } from 'redux-saga';
import { all, fork, put, take, takeEvery, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import {
  showNotification,
  updateNotification,
  NotificationCategories,
} from '../notifications';

import {
  RESUMABLE_UPLOAD_PROGRESS,
  RESUMABLE_UPLOAD_ERROR,
  RESUMABLE_UPLOAD_DONE,
} from './util/ResumableUpload';

import { COMPUTE_CHECKSUMS_PROGRESS } from './util/ComputeChecksums';

import {
  SET_FILE_NAME,
  UPLOAD_FILE_CANCEL_SUCCESS,
  uploadFileCancel,
  getExperimentId,
  getFileName,
  getProgress,
} from './uploadFile';

// file added

const _interactionChannel = channel();

export function* interactionChannelWatcher(): Generator<*, *, *> {
  while (true) {
    const action = yield take(_interactionChannel);
    yield put(action);
  }
}

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
        actions: [
          {
            title: 'View',
            onClick: () => {
              _interactionChannel.put(push(`/experiments/${experimentId}`));
            },
          },
          {
            title: 'Cancel',
            onClick: () => {
              if (
                !confirm(
                  `Cancel upload? This will also delete any associated metadata.`
                )
              ) {
                return;
              }
              _interactionChannel.put(uploadFileCancel());
            },
          },
        ],
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
        content: `Preparing ${fileName}`,
        progress,
      })
    );
  });
}

// upload events

function* resumableUploadProgressWatcher() {
  yield takeEvery(RESUMABLE_UPLOAD_PROGRESS, function*() {
    const experimentId = yield select(getExperimentId);
    const fileName = yield select(getFileName);
    const progress = yield select(getProgress);
    yield put(
      updateNotification(experimentId, {
        category: NotificationCategories.MESSAGE,
        content: `Uploading ${fileName}`,
        progress,
      })
    );
  });
}

function* resumableUploadDoneWatcher() {
  yield takeEvery(RESUMABLE_UPLOAD_DONE, function*() {
    const experimentId = yield select(getExperimentId);
    const fileName = yield select(getFileName);
    yield put(
      updateNotification(experimentId, {
        category: NotificationCategories.SUCCESS,
        content: `Finished uploading ${fileName}`,
        actions: [
          {
            title: 'View',
            onClick: () => {
              _interactionChannel.put(push(`/experiments/${experimentId}`));
            },
          },
        ],
      })
    );
  });
}

function* resumableUploadErrorWatcher() {
  yield takeEvery(RESUMABLE_UPLOAD_ERROR, function*(action: any) {
    const experimentId = yield select(getExperimentId);
    yield put(
      updateNotification(experimentId, {
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
    fork(resumableUploadProgressWatcher),
    fork(resumableUploadDoneWatcher),
    fork(resumableUploadErrorWatcher),
    fork(uploadFileCancelWatcher),
    fork(interactionChannelWatcher),
  ]);
}
