/* @flow */

import { ipcRenderer } from 'electron';
import { channel } from 'redux-saga';
import {
  all,
  fork,
  put,
  takeEvery,
  select,
  apply,
  call,
} from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { createSelector } from 'reselect';
import { push } from 'connected-react-router';
import parsePath from 'parse-filepath';

export const MAX_FILES = 2;

const app = require('electron').remote.app;
const fs = require('fs');

import { isString } from 'makeandship-js-common/src/util/is';
import { waitForChange } from 'makeandship-js-common/src/modules/util';

import { experimentActionTypes } from '../../modules/experiments/experiment';

import AnalyserLocalFile from './util/AnalyserLocalFile';
import * as UIHelpers from '../../helpers/UIHelpers'; // eslint-disable-line import/namespace

import {
  showNotification,
  hideAllNotifications,
  NotificationCategories,
} from '../notifications';

import detectFileSeq from './util/detectFileSeq';
import extensionForFileName from './util/extensionForFileName';

// TODO: refactor - does this need to be an event emitter?
const _analyserLocalFileChannel = channel();
const _analyserLocalFile = new AnalyserLocalFile();

_analyserLocalFile
  .on('progress', progress => {
    _analyserLocalFileChannel.put(analyseFileProgress(progress));
    UIHelpers.setProgress(progress);
  })
  .on('done', ({ json }) => {
    _analyserLocalFileChannel.put(analyseFileSuccess(json));
  })
  .on('error', error => {
    _analyserLocalFileChannel.put(analyseFileError(error.description));
  });

// watch, pass into the main channel

function* analyserLocalFileChannelWatcher() {
  yield takeEvery(_analyserLocalFileChannel, function*(action: any) {
    yield put(action);
  });
}

export const typePrefix = 'desktop/localAtlas/';

export const ANALYSE_FILE = `${typePrefix}ANALYSE_FILE`;
export const ANALYSE_FILE_ERROR = `${typePrefix}ANALYSE_FILE_ERROR`;
export const ANALYSE_FILE_SUCCESS = `${typePrefix}ANALYSE_FILE_SUCCESS`;
export const ANALYSE_FILE_PROGRESS = `${typePrefix}ANALYSE_FILE_PROGRESS`;
export const ANALYSE_FILE_CANCEL = `${typePrefix}ANALYSE_FILE_CANCEL`;
export const ANALYSE_FILE_NEW = `${typePrefix}ANALYSE_FILE_NEW`;
export const ANALYSE_FILE_SAVE = `${typePrefix}ANALYSE_FILE_SAVE`;
export const ANALYSE_FILE_SET_FILE_PATHS = `${typePrefix}ANALYSE_FILE_SET_FILE_PATHS`;

// Selectors

export const getState = (state: any) => state.desktop.localAtlas;

export const getIsAnalysing = createSelector(
  getState,
  state => state.isAnalysing
);

export const getProgress = createSelector(getState, state => state.progress);

export const getFilePaths = createSelector(getState, state => state.filePaths);

export const getFileNames = createSelector(
  getFilePaths,
  filePaths =>
    filePaths && filePaths.map(filePath => parsePath(filePath).basename)
);

export const getJson = createSelector(getState, state => state.json);

export const getError = createSelector(getState, state => state.error);

// Action creators

export const analyseFileNew = () => ({
  type: ANALYSE_FILE_NEW,
});

export const analyseFileSave = () => ({
  type: ANALYSE_FILE_SAVE,
});

export const analyseFile = (payload: string) => ({
  type: ANALYSE_FILE,
  payload,
});

export const analyseFileProgress = (payload: number) => ({
  type: ANALYSE_FILE_PROGRESS,
  payload,
});

export const analyseFileSuccess = (payload: any) => ({
  type: ANALYSE_FILE_SUCCESS,
  payload,
});

export const analyseFileCancel = () => ({
  type: ANALYSE_FILE_CANCEL,
});

export const analyseFileError = (payload: any) => ({
  type: ANALYSE_FILE_ERROR,
  payload,
});

export const analyseFileSetFilePaths = (payload: string) => ({
  type: ANALYSE_FILE_SET_FILE_PATHS,
  payload,
});

// Reducer

const initialState = {
  isAnalysing: false,
  filePaths: null,
  error: null,
  progress: 0,
  json: null,
};

const normalizeFilePaths = files => {
  if (isString(files)) {
    files = [files];
  }
  return files.map(file => (isString(file) ? file : file.path));
};

export default function reducer(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case ANALYSE_FILE:
      return {
        ...state,
        isAnalysing: true,
        filePaths: normalizeFilePaths(action.payload),
        error: undefined,
      };
    case ANALYSE_FILE_SET_FILE_PATHS:
      return {
        ...state,
        filePaths: normalizeFilePaths(action.payload),
      };
    case ANALYSE_FILE_CANCEL:
    case ANALYSE_FILE_NEW:
      return initialState;
    case ANALYSE_FILE_PROGRESS: {
      const { progress, total } = action.payload;
      return {
        ...state,
        progress: Math.round((100 * progress) / total),
      };
    }
    case ANALYSE_FILE_SUCCESS:
      return {
        ...state,
        isAnalysing: false,
        json: action.payload,
      };
    case ANALYSE_FILE_ERROR:
      return {
        ...initialState,
        error: action.payload,
      };
    default:
      return state;
  }
}

// Side effects

// start a new analysis of a local file

function* analyseFileWatcher() {
  yield takeEvery(ANALYSE_FILE, analyseFileWorker);
}

// detect a squence e.g. MDR_1 should find MDR_2 automatically

export function* analyseFileDetectFileSeq(): Saga {
  const filePaths = yield select(getFilePaths);
  if (filePaths.length !== 1) {
    return;
  }
  const filePath = filePaths[0];
  const extension = extensionForFileName(filePath);
  if (extension === '.json') {
    return;
  }

  const result = yield call(detectFileSeq, filePath);
  if (!result) {
    return;
  }
  filePaths.push(result);
  yield put(analyseFileSetFilePaths(filePaths));
  yield put(
    showNotification(
      `Detected ${parsePath(result).basename} for inclusion in analysis`
    )
  );
}

export function* analyseFileWorker(): Saga {
  yield put(hideAllNotifications());
  const initialFilePaths = yield select(getFilePaths);
  if (initialFilePaths.length > MAX_FILES) {
    yield put(
      analyseFileError(
        `Mykrobe is able to analyse a maximum of ${MAX_FILES} sequence files at once`
      )
    );
    return;
  }
  yield call(analyseFileDetectFileSeq);
  const filePaths = yield select(getFilePaths);
  yield apply(app, 'addRecentDocument', [filePaths[0]]);
  yield apply(_analyserLocalFile, 'analyseFile', [filePaths]);
  yield put(push('/'));
}

// cancel analysis

function* analyseFileCancelWatcher() {
  yield takeEvery(ANALYSE_FILE_CANCEL, analyseFileCancelWorker);
}

export function* analyseFileCancelWorker(): Saga {
  yield apply(_analyserLocalFile, 'cancel');
  yield put(push('/'));
  yield call(setRendererSaveEnabled, false);
}

// success

function* analyseFileSuccessWatcher() {
  yield takeEvery(ANALYSE_FILE_SUCCESS, analyseFileSuccessWorker);
}

export function* analyseFileSuccessWorker(): Saga {
  const json = yield select(getJson);
  const fileNames = yield select(getFileNames);
  // set the result as the experiment - the transformed version is now generated on-demand by selector
  // only one sample from Predictor
  const sampleIds = Object.keys(json);
  const sampleId = sampleIds[0];
  const sampleModel = json[sampleId];
  yield put({ type: experimentActionTypes.SET, payload: sampleModel });
  yield put(push('/results'));
  yield put(showNotification(`${fileNames.join(', ')} analysis complete`));
  yield call(setRendererSaveEnabled, true);
}

// failure

function* analyseFileErrorWatcher() {
  yield takeEvery(ANALYSE_FILE_ERROR, analyseFileErrorWorker);
}

export function* analyseFileErrorWorker(action: any): Saga {
  yield put(
    showNotification({
      category: NotificationCategories.ERROR,
      content: action.payload,
      autoHide: false,
      expanded: true,
    })
  );
  yield put(push('/'));
  yield call(setRendererSaveEnabled, false);
}

// new

function* analyseFileNewWatcher() {
  yield takeEvery(ANALYSE_FILE_NEW, analyseFileNewWorker);
}

export function* analyseFileNewWorker(): Saga {
  const isAnalysing = yield select(getIsAnalysing);
  if (isAnalysing) {
    yield put(analyseFileCancel());
  }
  yield put(push('/'));
  yield call(setRendererSaveEnabled, false);
}

// save

function* analyseFileSaveWatcher() {
  yield takeEvery(ANALYSE_FILE_SAVE, analyseFileSaveWorker);
}

export function* analyseFileSaveWorker(): Saga {
  const json = yield select(getJson);
  const filePath = UIHelpers.saveFileDialog('mykrobe.json'); // eslint-disable-line import/namespace
  if (filePath) {
    const prettyJson = JSON.stringify(json, null, 2);
    fs.writeFile(filePath, prettyJson, err => {
      if (err) {
        console.error(err);
      } else {
        console.log('JSON saved to ', filePath);
      }
    });
  }
}

export const setRendererSaveEnabled = (enabled: boolean) => {
  ipcRenderer.send('set-save-enabled', enabled);
};

// analysing state

export function* isAnalysingWatcher(): Saga {
  const isAnalysing = yield select(getIsAnalysing);
  yield call(setRendererIsAnalysing, isAnalysing);
  while (true) {
    const isAnalysing = yield waitForChange(getIsAnalysing);
    yield call(setRendererIsAnalysing, isAnalysing);
  }
}

export const setRendererIsAnalysing = (isAnalysing: boolean) => {
  ipcRenderer.send('set-is-analysing', isAnalysing);
};

// init

export function* localAtlasInit(): Saga {
  yield call(setRendererSaveEnabled, false);
}

export function* localAtlasSaga(): Saga {
  yield all([
    fork(localAtlasInit),
    fork(analyserLocalFileChannelWatcher),
    fork(analyseFileWatcher),
    fork(analyseFileCancelWatcher),
    fork(analyseFileSuccessWatcher),
    fork(analyseFileErrorWatcher),
    fork(analyseFileNewWatcher),
    fork(analyseFileSaveWatcher),
    fork(isAnalysingWatcher),
  ]);
}
