/* @flow */

import { all, fork, put, call, takeLatest } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { push } from 'connected-react-router';
import loadScript from 'load-script';

import * as APIConstants from '../../constants/APIConstants';

const SCRIPT_ID = 'dropboxjs';
const DROPBOX_SDK_URL = 'https://www.dropbox.com/static/api/2/dropins.js';

import { updateExperimentProvider, createExperimentId } from '../experiments';

export const typePrefix = 'upload/uploadDropbox/';

export const UPLOAD_DROPBOX = `${typePrefix}UPLOAD_DROPBOX`;

// Actions

export const uploadDropbox = () => ({
  type: UPLOAD_DROPBOX,
});

// Side effects

const isDropboxReady = () => {
  return !!window.Dropbox;
};

const loadDropbox = async () => {
  return new Promise((resolve, reject) => {
    loadScript(
      DROPBOX_SDK_URL,
      {
        attrs: {
          id: SCRIPT_ID,
          'data-app-key': window.env.REACT_APP_DROPBOX_APP_KEY,
        },
      },
      (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      }
    );
  });
};

const dropboxChoose = async () => {
  return new Promise((resolve) => {
    try {
      window.Dropbox.choose({
        success: (files) => {
          resolve(files);
        },
        cancel: () => {
          resolve();
        },
        linkType: 'direct',
        multiselect: false,
        extensions: APIConstants.API_SAMPLE_EXTENSIONS_ARRAY_WITH_DOTS,
      });
    } catch (error) {
      console.log(error);
    }
  });
};

function* uploadDropboxWatcher() {
  yield takeLatest(UPLOAD_DROPBOX, uploadDropboxWorker);
}

export function* uploadDropboxWorker(): Saga {
  const files = yield call(dropboxChoose);
  if (!files) {
    return;
  }
  const name = files[0].name;
  const path = files[0].link;
  const experimentId = yield call(createExperimentId, name);
  if (!experimentId) {
    return;
  }
  const experimentFile = {
    name,
    path,
    provider: 'dropbox',
  };
  yield put(
    updateExperimentProvider({
      id: experimentId,
      ...experimentFile,
    })
  );
  yield put(push(`/experiments/${experimentId}`));
}

export function* uploadDropboxSaga(): Saga {
  // cannot load and initiaite on-demand as it uses a pop-up window which requires suer interaction
  if (!isDropboxReady()) {
    yield call(loadDropbox);
  }
  yield all([fork(uploadDropboxWatcher)]);
}
