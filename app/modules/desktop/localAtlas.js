/* @flow */

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
import { push } from 'react-router-redux';
import parsePath from 'parse-filepath';

const remote = require('electron').remote;
const app = require('electron').remote.app;
const fs = require('fs');
const path = require('path');

import { experimentActionTypes } from '../../modules/experiments/experiment';

import AnalyserLocalFile from './util/AnalyserLocalFile';
import * as UIHelpers from '../../helpers/UIHelpers'; // eslint-disable-line import/namespace

import {
  showNotification,
  hideAllNotifications,
  NotificationCategories,
} from '../notifications';

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

// Selectors

export const getState = (state: any) => state.desktop.localAtlas;

export const getIsAnalysing = createSelector(
  getState,
  state => state.isAnalysing
);

export const getProgress = createSelector(getState, state => state.progress);

export const getFilePaths = createSelector(getState, state => state.filePaths);

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

export const analyseFileError = (payload: Error) => ({
  type: ANALYSE_FILE_ERROR,
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
  if (typeof files === 'string') {
    files = [files];
  }
  return files.map(file => (typeof file === 'string' ? file : file.path));
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

export function* detectFileSeq(): Saga {
  const filePaths = yield select(getFilePaths);
  if (filePaths.length !== 1) {
    return;
  }
  const filePath = filePaths[0];
  const dir = fs.readdirSync(path.dirname(filePath));
  console.log('dir', dir);
  debugger;
}

export function* analyseFileWorker(): Saga {
  yield call(detectFileSeq);
  const filePaths = yield select(getFilePaths);
  yield apply(app, 'addRecentDocument', [filePaths[0]]);
  yield apply(_analyserLocalFile, 'analyseFile', [filePaths]);
  yield put(hideAllNotifications());
  yield put(push('/'));
}

// cancel analysis

function* analyseFileCancelWatcher() {
  yield takeEvery(ANALYSE_FILE_CANCEL, analyseFileCancelWorker);
}

export function* analyseFileCancelWorker(): Saga {
  yield apply(_analyserLocalFile, 'cancel');
  yield put(push('/'));
  yield call(setSaveEnabled, false);
}

// success

function* analyseFileSuccessWatcher() {
  yield takeEvery(ANALYSE_FILE_SUCCESS, analyseFileSuccessWorker);
}

export function* analyseFileSuccessWorker(): Saga {
  const json = yield select(getJson);
  const filePaths = yield select(getFilePaths);
  const filePathBaseNames = filePaths.map(
    filePath => parsePath(filePath).basename
  );
  // set the result as the experiment - the transformed version is now generated on-demand by selector
  // only one sample from Predictor
  const sampleIds = Object.keys(json);
  const sampleId = sampleIds[0];
  const sampleModel = json[sampleId];
  yield put({ type: experimentActionTypes.SET, payload: sampleModel });
  yield put(push('/results'));
  yield put(
    showNotification(`${filePathBaseNames.join(', ')} analysis complete`)
  );
  yield call(setSaveEnabled, true);
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
  yield call(setSaveEnabled, false);
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
  yield call(setSaveEnabled, false);
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

export const setSaveEnabled = (enabled: boolean) => {
  const menu = remote.Menu.getApplicationMenu();
  if (process.platform === 'darwin') {
    menu.items[1].submenu.items[4].enabled = enabled;
  }
};

export function* localAtlasSaga(): Saga {
  yield all([
    fork(analyserLocalFileChannelWatcher),
    fork(analyseFileWatcher),
    fork(analyseFileCancelWatcher),
    fork(analyseFileSuccessWatcher),
    fork(analyseFileErrorWatcher),
    fork(analyseFileNewWatcher),
    fork(analyseFileSaveWatcher),
  ]);
}
