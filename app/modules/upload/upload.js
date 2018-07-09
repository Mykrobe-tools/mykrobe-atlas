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
import SparkMD5 from 'spark-md5';

import {
  SUCCESS,
  FAILURE,
  CREATE,
} from 'makeandship-js-common/src/modules/generic/actions';

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
  createExperiment,
  getExperiment,
  experimentActionType,
} from '../experiments/experiment';

import UploadFile from '../../services/upload/UploadFile';
import UploadBox from '../../services/upload/UploadBox';
import UploadDropbox from '../../services/upload/UploadDropbox';
import UploadGoogleDrive from '../../services/upload/UploadGoogleDrive';
import UploadOneDrive from '../../services/upload/UploadOneDrive';

const acceptedExtensions = ['json', 'bam', 'gz', 'fastq', 'jpg'];

const computeChecksumChannel = channel();
const uploadFileChannel = channel();

// TODO: refactor these and move into module

const _uploadFile = new UploadFile(acceptedExtensions);
const _uploadBox = new UploadBox();
const _uploadDropbox = new UploadDropbox(acceptedExtensions);
const _uploadGoogleDrive = new UploadGoogleDrive();
const _uploadOneDrive = new UploadOneDrive();

export const typePrefix = 'upload/upload/';

export const UPLOAD_FILE_ASSIGN_DROP = `${typePrefix}UPLOAD_FILE_ASSIGN_DROP`;
export const UPLOAD_FILE_ASSIGN_BROWSE = `${typePrefix}UPLOAD_FILE_ASSIGN_BROWSE`;
export const UPLOAD_FILE_UNASSIGN_DROP = `${typePrefix}UPLOAD_FILE_UNASSIGN_DROP`;

export const FILE_ADDED = `${typePrefix}FILE_ADDED`;
export const COMPUTE_CHECKSUMS = `${typePrefix}COMPUTE_CHECKSUMS`;
export const COMPUTE_CHECKSUMS_PROGRESS = `${typePrefix}COMPUTE_CHECKSUMS_PROGRESS`;
export const COMPUTE_CHECKSUMS_COMPLETE = `${typePrefix}COMPUTE_CHECKSUMS_COMPLETE`;

export const UPLOAD_FILE = `${typePrefix}UPLOAD_FILE`;
export const UPLOAD_FILE_PROGRESS = `${typePrefix}UPLOAD_FILE_PROGRESS`;
export const UPLOAD_FILE_ERROR = `${typePrefix}UPLOAD_FILE_ERROR`;
export const UPLOAD_FILE_DONE = `${typePrefix}UPLOAD_FILE_DONE`;

// Actions

export const uploadFile = (payload: any) => ({
  type: UPLOAD_FILE,
  payload,
});

export const uploadFileAssignDrop = (payload: any) => ({
  type: UPLOAD_FILE_ASSIGN_DROP,
  payload,
});

export const uploadFileAssignBrowse = (payload: any) => ({
  type: UPLOAD_FILE_ASSIGN_BROWSE,
  payload,
});

export const uploadFileUnassignDrop = (payload: any) => ({
  type: UPLOAD_FILE_UNASSIGN_DROP,
  payload,
});

// set the values on resumablejs instance when components are available

function* uploadFileAssignDropWatcher() {
  yield takeEvery(UPLOAD_FILE_ASSIGN_DROP, function*(action: any) {
    yield apply(_uploadFile, 'assignDrop', [action.payload]);
  });
}

function* uploadFileUnassignDropWatcher() {
  yield takeEvery(UPLOAD_FILE_UNASSIGN_DROP, function*(action: any) {
    yield apply(_uploadFile, 'unAssignDrop', [action.payload]);
  });
}

function* uploadFileAssignBrowseWatcher() {
  yield takeEvery(UPLOAD_FILE_ASSIGN_BROWSE, function*(action: any) {
    yield apply(_uploadFile, 'assignBrowse', [action.payload]);
  });
}

// set the access token on resumablejs when it changes

function* accessTokenWatcher() {
  yield takeEvery([INITIALISE_SUCCESS, SET_TOKEN], accessTokenWorker);
}

export function* accessTokenWorker(): Generator<*, *, *> {
  const accessToken = yield select(getAccessToken);
  yield apply(_uploadFile, 'setAccessToken', [accessToken]);
}

// take emitted events, put actions into channel
// then send those into the main channel

export function* fileAddedEventEmitterWatcher(): Generator<*, *, *> {
  _uploadFile
    .on('fileAdded', payload => {
      uploadFileChannel.put({ type: FILE_ADDED, payload });
    })
    .on('progress', payload => {
      uploadFileChannel.put({ type: UPLOAD_FILE_PROGRESS, payload });
    })
    .on('error', payload => {
      uploadFileChannel.put({ type: UPLOAD_FILE_ERROR, payload });
    })
    .on('done', payload => {
      uploadFileChannel.put({ type: UPLOAD_FILE_DONE, payload });
    });
  while (true) {
    const action = yield take(uploadFileChannel);
    yield put(action);
  }
}

// process the added file

function* fileAddedWatcher() {
  yield takeEvery(FILE_ADDED, fileAddedWorker);
}

export function* fileAddedWorker(action: any): Generator<*, *, *> {
  // create an id for the experiment
  yield put(createExperiment());
  const { success } = yield race({
    success: take(experimentActionType(CREATE, SUCCESS)),
    failure: take(experimentActionType(CREATE, FAILURE)),
  });
  if (!success) {
    return;
  }
  const experiment = yield select(getExperiment);
  // TODO: use the id as a unique identifier for all actions
  yield apply(_uploadFile, 'setId', [experiment.id]);
  yield put({ type: COMPUTE_CHECKSUMS, payload: action.payload });
}

// calculate checksums

function* computeChecksumsWatcher() {
  yield takeEvery(COMPUTE_CHECKSUMS, computeChecksumsWorker);
}

export function* computeChecksumsWorker(action: any): Generator<*, *, *> {
  yield call(computeChecksums, action.payload);
  yield take(COMPUTE_CHECKSUMS_COMPLETE);
  yield put({
    type: UPLOAD_FILE,
    payload: action.payload,
  });
}

// TODO: move into separate utility module

export function computeChecksums(
  resumableFile: Object,
  offset: number = 0,
  fileReader: ?FileReader = null
) {
  const round = resumableFile.resumableObj.getOpt('forceChunkSize')
    ? Math.ceil
    : Math.floor;
  const chunkSize = resumableFile.getOpt('chunkSize');
  const numChunks = Math.max(round(resumableFile.file.size / chunkSize), 1);
  const forceChunkSize = resumableFile.getOpt('forceChunkSize');
  const func = resumableFile.file.slice
    ? 'slice'
    : resumableFile.file.mozSlice
      ? 'mozSlice'
      : resumableFile.file.webkitSlice
        ? 'webkitSlice'
        : 'slice';
  let startByte;
  let endByte;
  let bytes;

  resumableFile.hashes = resumableFile.hashes || [];
  fileReader = fileReader || new FileReader();

  startByte = offset * chunkSize;
  endByte = Math.min(resumableFile.file.size, (offset + 1) * chunkSize);

  if (resumableFile.file.size - endByte < chunkSize && !forceChunkSize) {
    endByte = resumableFile.file.size;
  }
  bytes = resumableFile.file[func](startByte, endByte);

  fileReader.onloadend = e => {
    var spark = SparkMD5.ArrayBuffer.hash(e.target.result);
    resumableFile.hashes.push(spark);
    if (numChunks > offset + 1) {
      computeChecksumChannel.put({
        type: COMPUTE_CHECKSUMS_PROGRESS,
        payload: Math.floor((offset / numChunks) * 100),
      });
      computeChecksums(resumableFile, offset + 1, fileReader);
    } else {
      computeChecksumChannel.put({
        type: COMPUTE_CHECKSUMS_COMPLETE,
      });
    }
  };
  fileReader.readAsArrayBuffer(bytes);
}

// watch, pass into the main channel

function* computeChecksumsChannelWatcher() {
  yield takeEvery(computeChecksumChannel, function*(action: any) {
    yield put(action);
  });
}

// upload the file

function* uploadFileWatcher() {
  yield takeEvery(UPLOAD_FILE, uploadFileWorker);
}

export function* uploadFileWorker(action: any): Generator<*, *, *> {
  console.log('uploadFileWorker', action);
  // this will request a fresh token if necessary
  yield put(checkToken());
  const { failure } = yield race({
    checked: take(CHECK_TOKEN_SUCCESS),
    success: take(REFRESH_TOKEN_SUCCESS),
    failure: take(REFRESH_TOKEN_FAIL),
  });
  if (failure) {
    return;
  }
  yield apply(_uploadFile, 'startUpload');
}

export function* uploadSaga(): Generator<*, *, *> {
  yield all([
    fork(fileAddedEventEmitterWatcher),
    fork(fileAddedWatcher),
    fork(computeChecksumsWatcher),
    fork(computeChecksumsChannelWatcher),
    fork(accessTokenWatcher),
    fork(uploadFileWatcher),
    fork(uploadFileAssignDropWatcher),
    fork(uploadFileUnassignDropWatcher),
    fork(uploadFileAssignBrowseWatcher),
  ]);
}
