/* @flow */

import { all, fork, put, call, takeLatest } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { push } from 'connected-react-router';
import loadScript from 'load-script';

const ONEDRIVE_SDK_URL = 'https://js.live.net/v7.0/OneDrive.js';

import { updateExperimentProvider, createExperimentId } from '../experiments';

export const typePrefix = 'upload/uploadOneDrive/';

export const UPLOAD_ONE_DRIVE = `${typePrefix}UPLOAD_ONE_DRIVE`;

// Actions

export const uploadOneDrive = () => ({
  type: UPLOAD_ONE_DRIVE,
});

// Side effects

const isOneDriveReady = () => {
  return !!window.OneDrive;
};

const loadOneDrive = async () => {
  return new Promise((resolve, reject) => {
    loadScript(ONEDRIVE_SDK_URL, error => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
};

const oneDriveChoose = async () => {
  return new Promise(resolve => {
    window.OneDrive.open({
      clientId: process.env.ONEDRIVE_CLIENT_ID,
      action: 'download',
      multiSelect: false,
      openInNewWindow: true,
      success: files => {
        resolve(files);
      },
      cancel: () => {
        resolve();
      },
    });
  });
};

function* uploadOneDriveWatcher() {
  yield takeLatest(UPLOAD_ONE_DRIVE, uploadOneDriveWorker);
}

export function* uploadOneDriveWorker(): Saga {
  const files = yield call(oneDriveChoose);
  if (!files) {
    return;
  }
  const experimentId = yield call(createExperimentId);
  if (!experimentId) {
    return;
  }
  const experimentFile = {
    name: files.value[0].name,
    path: files.value[0]['@microsoft.graph.downloadUrl'],
    provider: 'oneDrive',
  };
  yield put(
    updateExperimentProvider({
      id: experimentId,
      ...experimentFile,
    })
  );
  yield put(push(`/experiments/${experimentId}`));
}

export function* uploadOneDriveSaga(): Saga {
  if (!isOneDriveReady()) {
    yield call(loadOneDrive);
  }
  yield all([fork(uploadOneDriveWatcher)]);
}
