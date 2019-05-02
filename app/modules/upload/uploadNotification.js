/* @flow */

import { channel } from 'redux-saga';
import { all, fork, put, take, takeEvery, select } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { push } from 'connected-react-router';
import moment from 'moment';

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
  ANALYSIS_STARTED,
  ANALYSIS_COMPLETE,
  UPLOAD_THIRD_PARTY_PROGRESS,
  UPLOAD_THIRD_PARTY_DONE,
} from '../users/currentUserEvents';

import {
  SET_FILE_NAME,
  UPLOAD_FILE_CANCEL,
  uploadFileCancel,
  getExperimentId,
  getFileName,
  getProgress,
  getIsUploading,
  getUploadCompletionTime,
} from './uploadFile';

// file added

const _interactionChannel = channel();

export function* interactionChannelWatcher(): Saga {
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
            title: 'Metadata',
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
        content: `${progress}% Preparing ${fileName}`,
        progress,
      })
    );
  });
}

// upload events

function* resumableUploadProgressWatcher() {
  yield takeEvery(RESUMABLE_UPLOAD_PROGRESS, function*() {
    const isUploading = yield select(getIsUploading);
    if (!isUploading) {
      return;
    }
    const experimentId = yield select(getExperimentId);
    const fileName = yield select(getFileName);
    const progress = yield select(getProgress);
    const uploadCompletionTime = yield select(getUploadCompletionTime);
    const to = uploadCompletionTime && moment().to(uploadCompletionTime);
    let components = [`${progress}% Uploading ${fileName}`];
    to && components.push(`eta ${to}`);
    yield put(
      updateNotification(experimentId, {
        category: NotificationCategories.MESSAGE,
        content: components.join(', '),
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
            title: 'Metadata',
            onClick: () => {
              _interactionChannel.put(push(`/experiments/${experimentId}`));
            },
          },
        ],
        progress: undefined,
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
  yield takeEvery(UPLOAD_FILE_CANCEL, function*() {
    const experimentId = yield select(getExperimentId);
    yield put(
      updateNotification(experimentId, {
        category: NotificationCategories.MESSAGE,
        content: 'Upload cancelled',
        progress: undefined,
        actions: undefined,
        autoHide: true,
      })
    );
  });
}

// third party uploads

function* thirdPartyUploadProgressWatcher() {
  yield takeEvery(UPLOAD_THIRD_PARTY_PROGRESS, function*(action) {
    const {
      payload: { id: experimentId, file: fileName, provider, size, totalSize },
    } = action;
    const progress = Math.round((100 * size) / totalSize);
    yield put(
      updateNotification(experimentId, {
        category: NotificationCategories.MESSAGE,
        content: `${progress}% Retrieving ${fileName} from ${provider}`,
        progress,
      })
    );
  });
}

function* thirdPartyUploadDoneWatcher() {
  yield takeEvery(UPLOAD_THIRD_PARTY_DONE, function*(action) {
    const {
      payload: { id: experimentId, file: fileName, provider },
    } = action;
    yield put(
      updateNotification(experimentId, {
        category: NotificationCategories.SUCCESS,
        content: `Finished retreiving ${fileName} from ${provider}`,
        actions: [
          {
            title: 'Metadata',
            onClick: () => {
              _interactionChannel.put(push(`/experiments/${experimentId}`));
            },
          },
        ],
        progress: undefined,
      })
    );
  });
}

// analysis events - not just for current upload

function* analysisStartedWatcher() {
  yield takeEvery(ANALYSIS_STARTED, function*(action: any) {
    const experimentId = action.payload.id;
    const fileName = action.payload.file;
    yield put(
      updateNotification(experimentId, {
        category: NotificationCategories.MESSAGE,
        content: `Analysis started ${fileName}`,
        progress: 0,
      })
    );
  });
}

function* analysisCompleteWatcher() {
  yield takeEvery(ANALYSIS_COMPLETE, function*(action: any) {
    const experimentId = action.payload.id;
    const fileName = action.payload.file;
    yield put(
      updateNotification(experimentId, {
        category: NotificationCategories.SUCCESS,
        content: `Analysis complete ${fileName}`,
        actions: [
          {
            title: 'Resistance',
            onClick: () => {
              _interactionChannel.put(
                push(`/experiments/${experimentId}/resistance`)
              );
            },
          },
        ],
        progress: undefined,
      })
    );
  });
}

export function* uploadNotificationSaga(): Saga {
  yield all([
    fork(fileAddedWatcher),
    fork(computeChecksumsProgressWatcher),
    fork(resumableUploadProgressWatcher),
    fork(resumableUploadDoneWatcher),
    fork(resumableUploadErrorWatcher),
    fork(uploadFileCancelWatcher),
    fork(analysisStartedWatcher),
    fork(analysisCompleteWatcher),
    fork(interactionChannelWatcher),
    fork(thirdPartyUploadProgressWatcher),
    fork(thirdPartyUploadDoneWatcher),
  ]);
}
