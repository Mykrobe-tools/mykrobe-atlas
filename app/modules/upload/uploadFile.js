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
import type { Saga } from 'redux-saga';
import { createSelector } from 'reselect';
import { push } from 'connected-react-router';
import * as dateFns from 'date-fns';
import produce from 'immer';

import {
  getAccessToken,
  checkToken,
  authActionTypes,
} from 'makeandship-js-common/src/modules/auth';
import { waitForChange } from 'makeandship-js-common/src/modules/util';

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

const _computeChecksumChannel = channel();
const _uploadFileChannel = channel();
const _uploadFile = new ResumableUpload(
  _uploadFileChannel,
  APIConstants.API_SAMPLE_EXTENSIONS_ARRAY
);
const _computeChecksums = new ComputeChecksums(_computeChecksumChannel);

export const typePrefix = 'upload/uploadFile/';

export const UPLOAD_FILE = `${typePrefix}UPLOAD_FILE`;
export const UPLOAD_FILE_CANCEL = `${typePrefix}UPLOAD_FILE_CANCEL`;
export const UPLOAD_FILE_CANCEL_SUCCESS = `${typePrefix}UPLOAD_FILE_CANCEL_SUCCESS`;

export const UPLOAD_FILE_DROP = `${typePrefix}UPLOAD_FILE_DROP`;
export const UPLOAD_FILE_ASSIGN_BROWSE = `${typePrefix}UPLOAD_FILE_ASSIGN_BROWSE`;

export const COMPUTE_CHECKSUMS = `${typePrefix}COMPUTE_CHECKSUMS`;

export const SET_EXPERIMENT_ID = `${typePrefix}SET_EXPERIMENT_ID`;
export const SET_FILE_NAME = `${typePrefix}SET_FILE_NAME`;

// Selectors

export const getState = (state: any) => state.upload.uploadFile;

export const getIsUploading = createSelector(
  getState,
  (state) => state.isUploading
);

export const getUploadProgress = createSelector(
  getState,
  (state) => state.uploadProgress
);

export const getUploadCompletionTime = createSelector(getState, (state) => {
  const { uploadBeganAt, uploadProgress } = state;
  if (!uploadProgress) {
    return undefined;
  }
  const millisecondsSoFar = dateFns.differenceInMilliseconds(
    new Date(),
    dateFns.parseISO(uploadBeganAt)
  );
  const projectedMillisecondsTotal = millisecondsSoFar / uploadProgress;
  return dateFns.addMilliseconds(
    dateFns.parseISO(uploadBeganAt),
    projectedMillisecondsTotal
  );
});

export const getIsComputingChecksums = createSelector(
  getState,
  (state) => state.isComputingChecksums
);

export const getChecksumProgress = createSelector(
  getState,
  (state) => state.checksumProgress
);

export const getIsBusy = createSelector(
  getIsUploading,
  getIsComputingChecksums,
  (isUploading, isComputingChecksums) => isUploading || isComputingChecksums
);

export const getProgress = createSelector(
  getChecksumProgress,
  getUploadProgress,
  (checksumProgress, uploadProgress) =>
    Math.round(100 * (checksumProgress * 0.1 + uploadProgress * 0.9))
);

export const getFileName = createSelector(getState, (state) => state.fileName);

export const getExperimentId = createSelector(
  getState,
  (state) => state.experimentId
);

// Actions

export const uploadFile = (payload: any) => ({
  type: UPLOAD_FILE,
  payload,
});

export const uploadFileDrop = (payload: any) => ({
  type: UPLOAD_FILE_DROP,
  payload,
});

export const uploadFileCancel = () => ({
  type: UPLOAD_FILE_CANCEL,
});

export const uploadFileAssignBrowse = (payload: any) => ({
  type: UPLOAD_FILE_ASSIGN_BROWSE,
  payload,
});

export const setExperimentId = (payload: string) => ({
  type: SET_EXPERIMENT_ID,
  payload,
});

export const setFileName = (payload: string) => ({
  type: SET_FILE_NAME,
  payload,
});

// Reducer

const initialState = {
  isUploading: false,
  isComputingChecksums: false,
  uploadProgress: 0,
  checksumProgress: 0,
};

const reducer = (state?: State = initialState, action?: Object = {}): State =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPLOAD_FILE_CANCEL_SUCCESS:
        return initialState;
      case SET_FILE_NAME:
        draft.fileName = action.payload;
        return;
      case SET_EXPERIMENT_ID:
        draft.experimentId = action.payload;
        return;
      case COMPUTE_CHECKSUMS:
        draft.isComputingChecksums = true;
        return;
      case COMPUTE_CHECKSUMS_PROGRESS:
        draft.checksumProgress = action.payload;
        return;
      case COMPUTE_CHECKSUMS_COMPLETE:
        Object.assign(draft, {
          checksumProgress: 1,
          isComputingChecksums: false,
        });
        return;
      case UPLOAD_FILE:
        Object.assign(draft, {
          isUploading: true,
          uploadBeganAt: dateFns.formatISO(new Date()),
        });
        return;
      case RESUMABLE_UPLOAD_PROGRESS:
        draft.uploadProgress = action.payload;
        return;
      case RESUMABLE_UPLOAD_DONE:
        Object.assign(draft, {
          isUploading: false,
          uploadProgress: 0,
          checksumProgress: 0,
        });
        return;
      case RESUMABLE_UPLOAD_ERROR:
        Object.assign(draft, {
          isUploading: false,
          error: action.payload,
        });
        return;
      default:
        return;
    }
  });

export default reducer;

// set the values on resumablejs instance when components are available
// we keep a ref to the dropzone so we can

function* uploadFileDropWatcher() {
  yield takeEvery(UPLOAD_FILE_DROP, function* (action: any) {
    yield apply(_uploadFile, 'onDrop', [action.payload]);
  });
}

function* uploadFileAssignBrowseWatcher() {
  yield takeEvery(UPLOAD_FILE_ASSIGN_BROWSE, function* (action: any) {
    yield apply(_uploadFile, 'assignBrowse', [action.payload]);
  });
}

// set the access token on resumablejs when it changes

export function* accessTokenWatcher(): Saga {
  yield fork(accessTokenWorker);
  while (true) {
    yield waitForChange(getAccessToken);
    yield fork(accessTokenWorker);
  }
}

export function* accessTokenWorker(): Saga {
  const accessToken = yield select(getAccessToken);
  yield apply(_uploadFile, 'setAccessToken', [accessToken]);
}

// take emitted events, put actions into channel
// then send those into the main channel

export function* fileAddedEventEmitterWatcher(): Saga {
  while (true) {
    const action = yield take(_uploadFileChannel);
    yield put(action);
  }
}

// process the added file

function* fileAddedWatcher() {
  yield takeEvery(RESUMABLE_UPLOAD_FILE_ADDED, fileAddedWorker);
}

export function* fileAddedWorker(action: any): Saga {
  const isBusy = yield select(getIsBusy);
  if (isBusy) {
    alert(
      'Please cancel or wait for current upload to finish before uploading another sample'
    );
    return;
  }
  const experimentId = yield call(createExperimentId);
  if (!experimentId) {
    return;
  }
  // TODO: use the id as a unique identifier for all actions
  yield apply(_uploadFile, 'setId', [experimentId]);
  yield put(setExperimentId(experimentId));
  yield put(setFileName(action.payload.fileName));
  yield put(push(`/experiments/${experimentId}`));
  yield put({ type: COMPUTE_CHECKSUMS, payload: action.payload });
}

// calculate checksums

function* computeChecksumsWatcher() {
  yield takeEvery(COMPUTE_CHECKSUMS, computeChecksumsWorker);
}

export function* computeChecksumsWorker(action: any): Saga {
  yield apply(_computeChecksums, 'computeChecksums', [action.payload]);
  yield take(COMPUTE_CHECKSUMS_COMPLETE);
  yield put({
    type: UPLOAD_FILE,
    payload: action.payload,
  });
}

// watch, pass into the main channel

function* computeChecksumsChannelWatcher() {
  yield takeEvery(_computeChecksumChannel, function* (action: any) {
    yield put(action);
  });
}

// upload the file

function* uploadFileWatcher() {
  yield takeEvery(UPLOAD_FILE, uploadFileWorker);
}

export function* uploadFileWorker(): Saga {
  // this will request a fresh token if necessary
  yield put(checkToken());
  const { failure } = yield race({
    checked: take(authActionTypes.CHECK_TOKEN_SUCCESS),
    success: take(authActionTypes.REFRESH_TOKEN_SUCCESS),
    failure: take(authActionTypes.REFRESH_TOKEN_FAIL),
  });
  if (failure) {
    return;
  }
  yield apply(_uploadFile, 'startUpload');
}

// upload events

function* uploadFileCancelWatcher() {
  yield takeEvery(
    [
      UPLOAD_FILE_CANCEL,
      authActionTypes.LOGOUT_SUCCESS,
      authActionTypes.SESSION_EXPIRED_SUCCESS,
    ],
    function* () {
      const experimentId = yield select(getExperimentId);
      yield apply(_uploadFile, 'cancel');
      yield apply(_computeChecksums, 'cancel');
      if (experimentId) {
        yield put(deleteExperiment(experimentId));
      }
      yield put({ type: UPLOAD_FILE_CANCEL_SUCCESS });
    }
  );
}

export function* uploadFileSaga(): Saga {
  yield all([
    fork(fileAddedEventEmitterWatcher),
    fork(fileAddedWatcher),
    fork(computeChecksumsWatcher),
    fork(computeChecksumsChannelWatcher),
    fork(accessTokenWatcher),
    fork(uploadFileWatcher),
    fork(uploadFileAssignBrowseWatcher),
    fork(uploadFileCancelWatcher),
    fork(uploadFileDropWatcher),
  ]);
}
