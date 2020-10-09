/* @flow */

import { channel } from 'redux-saga';
import {
  all,
  fork,
  put,
  take,
  takeEvery,
  select,
  call,
  apply,
  takeLeading,
} from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import type { ResumableFile } from 'resumablejs';
import { createSelector } from 'reselect';
import { push } from 'connected-react-router';
import * as dateFns from 'date-fns';
import produce from 'immer';

import { getConfig } from 'makeandship-js-common/src/modules/auth/config';

import * as APIConstants from '../../constants/APIConstants';
import {
  createExperimentId,
  deleteExperiment,
} from '../experiments/experiment';

import ResumableUpload, {
  RESUMABLE_UPLOAD_FILES_ADDED,
  RESUMABLE_UPLOAD_PROGRESS,
  RESUMABLE_UPLOAD_ERROR,
  RESUMABLE_UPLOAD_DONE,
} from './util/ResumableUpload';

import ComputeChecksums, {
  COMPUTE_CHECKSUMS_PROGRESS,
  COMPUTE_CHECKSUMS_COMPLETE,
} from './util/ComputeChecksums';
import detectFileSeqForFileNameInArray from '../../util/detectFileSeqForFileNameInArray';
import prettyFileName from '../../util/prettyFileName';

const _computeChecksumChannel = channel();
const _resumableUploadChannel = channel();
const _uploadFile = new ResumableUpload(
  _resumableUploadChannel,
  APIConstants.API_SAMPLE_EXTENSIONS_ARRAY
);
const _computeChecksums = {};

export const typePrefix = 'upload/uploadFile/';

export const UPLOAD_FILES = `${typePrefix}UPLOAD_FILES`;
export const UPLOAD_FILES_CANCEL = `${typePrefix}UPLOAD_FILES_CANCEL`;
export const UPLOAD_FILES_CANCEL_SUCCESS = `${typePrefix}UPLOAD_FILES_CANCEL_SUCCESS`;

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

export const getChecksumProgressById = createSelector(
  getState,
  (state) => state.checksumProgressById
);

export const getChecksumProgress = createSelector(
  getChecksumProgressById,
  (checksumProgressById) => {
    const values = Object.values(checksumProgressById);
    const total = values.reduce((a, b) => a + b, 0);
    return total / values.length;
  }
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
  type: UPLOAD_FILES,
  payload,
});

export const uploadFileDrop = (payload: any) => ({
  type: UPLOAD_FILE_DROP,
  payload,
});

export const uploadFileCancel = () => ({
  type: UPLOAD_FILES_CANCEL,
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

export type State = {
  isUploading: boolean,
  isComputingChecksums: boolean,
  uploadProgress: number,
  checksumProgressById: { [string]: number },
  fileName?: string,
  experimentId?: string,
  uploadBeganAt?: string,
  error?: any,
};

const initialState: State = {
  isUploading: false,
  isComputingChecksums: false,
  uploadProgress: 0,
  checksumProgressById: {},
};

const reducer = (state?: State = initialState, action?: Object = {}): State =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPLOAD_FILES_CANCEL_SUCCESS:
        return initialState;
      case SET_FILE_NAME:
        draft.fileName = action.payload;
        return;
      case SET_EXPERIMENT_ID:
        draft.experimentId = action.payload;
        return;
      case COMPUTE_CHECKSUMS:
        draft.checksumProgressById = {};
        draft.isComputingChecksums = true;
        return;
      case COMPUTE_CHECKSUMS_PROGRESS:
        draft.checksumProgressById[action.meta] = action.payload;
        return;
      case COMPUTE_CHECKSUMS_COMPLETE: {
        draft.checksumProgressById[action.meta] = 1;
        return;
      }
      case UPLOAD_FILES:
        Object.assign(draft, {
          isComputingChecksums: false,
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
          checksumProgressById: {},
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

// take emitted events, put actions into channel
// then send those into the main channel

export function* resumableUploadChannelWatcher(): Saga {
  while (true) {
    const action = yield take(_resumableUploadChannel);
    yield put(action);
  }
}

// process the added file

function* filesAddedWatcher() {
  yield takeEvery(RESUMABLE_UPLOAD_FILES_ADDED, filesAddedWorker);
}

export function* filesAddedWorker(action: any): Saga {
  const isBusy = yield select(getIsBusy);
  if (isBusy) {
    alert(
      'Please cancel or wait for current upload to finish before uploading another sample'
    );
    return;
  }
  const files: Array<ResumableFile> = action.payload;
  const fileNames = files.map((file) => {
    return file.fileName;
  });
  if (fileNames.length > 1) {
    const seq = detectFileSeqForFileNameInArray(fileNames[0], fileNames);
    if (!seq) {
      const fileNamesSequence = fileNames.join(', ');
      if (
        !confirm(
          `${fileNamesSequence} do not appear to be sequential names. Analyse as a pair anyway?`
        )
      ) {
        // reset the file list
        yield put({ type: UPLOAD_FILES_CANCEL });
        return;
      }
    }
  }
  const fileName = files
    .map((file) => {
      const fileName = file.fileName;
      const pretty = prettyFileName(fileName);
      console.log({ pretty, fileName });
      return pretty || fileName;
    })
    .join(', ');
  const experimentId = yield call(createExperimentId, fileName);
  if (!experimentId) {
    return;
  }
  // TODO: use the id as a unique identifier for all actions
  yield apply(_uploadFile, 'setId', [experimentId]);
  yield put(setExperimentId(experimentId));
  yield put(setFileName(fileName));
  yield put(push(`/experiments/${experimentId}`));
  yield put({ type: COMPUTE_CHECKSUMS, payload: files });
}

// calculate checksums

const cancelChecksums = () => {
  Object.entries(_computeChecksums).forEach(
    ([uniqueIdentifier, computeChecksums]) => {
      computeChecksums.cancel();
      delete _computeChecksums[uniqueIdentifier];
    }
  );
};

function* computeChecksumsWatcher() {
  yield takeEvery(COMPUTE_CHECKSUMS, computeChecksumsWorker);
}

export function* computeChecksumsWorker(action: any): Saga {
  yield call(cancelChecksums);
  const files = action.payload;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    yield put({
      type: COMPUTE_CHECKSUMS_PROGRESS,
      payload: 0,
      meta: file.uniqueIdentifier,
    });
    const computeChecksums = new ComputeChecksums(_computeChecksumChannel);
    _computeChecksums[file.uniqueIdentifier] = computeChecksums;
    computeChecksums.computeChecksums(file);
  }
}

export function* computeChecksumsCompleteWatcher(): Saga {
  yield takeLeading(COMPUTE_CHECKSUMS_COMPLETE, function* () {
    const checksumProgress = yield select(getChecksumProgress);
    if (checksumProgress === 1) {
      yield put({ type: UPLOAD_FILES });
    }
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
  yield takeLeading(UPLOAD_FILES, uploadFileWorker);
}

export function* uploadFileWorker(): Saga {
  const config = yield call(getConfig);
  yield call(config.provider.updateToken);
  const token = yield call(config.provider.getToken);
  if (token) {
    yield apply(_uploadFile, 'setAccessToken', [token]);
  }
  yield apply(_uploadFile, 'startUpload');
}

// upload events

function* uploadFileCancelWatcher() {
  yield takeEvery([UPLOAD_FILES_CANCEL], function* () {
    const experimentId = yield select(getExperimentId);
    yield apply(_uploadFile, 'cancel');
    yield call(cancelChecksums);
    if (experimentId) {
      yield put(deleteExperiment(experimentId));
    }
    yield put({ type: UPLOAD_FILES_CANCEL_SUCCESS });
  });
}

export function* uploadFileSaga(): Saga {
  yield all([
    fork(resumableUploadChannelWatcher),
    fork(filesAddedWatcher),
    fork(computeChecksumsWatcher),
    fork(computeChecksumsCompleteWatcher),
    fork(computeChecksumsChannelWatcher),
    fork(uploadFileWatcher),
    fork(uploadFileAssignBrowseWatcher),
    fork(uploadFileCancelWatcher),
    fork(uploadFileDropWatcher),
  ]);
}
