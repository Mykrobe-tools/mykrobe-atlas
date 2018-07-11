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
  takeLatest,
} from 'redux-saga/effects';
import { push } from 'react-router-redux';
import loadScript from 'load-script';

import {
  showNotification,
  NotificationCategories,
} from 'makeandship-js-common/src/modules/notifications';

import config from '../../config';

const DROPBOX_SDK_URL = 'https://www.dropbox.com/static/api/2/dropins.js';
const SCRIPT_ID = 'dropboxjs';

import { updateExperimentFile, createExperimentId } from '../experiments';

const acceptedExtensions = ['json', 'bam', 'gz', 'fastq', 'jpg'];

export const typePrefix = 'upload/uploadDropbox/';

export const UPLOAD_DROPBOX = `${typePrefix}UPLOAD_DROPBOX`;

// Actions

export const uploadDropbox = (payload: any) => ({
  type: UPLOAD_DROPBOX,
  payload,
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
          'data-app-key': config.DROPBOX_APP_KEY,
        },
      },
      (error, script) => {
        if (error) {
          return reject(error);
        }
        return resolve(script);
      }
    );
  });
};

const dropboxChoose = async () => {
  return new Promise(resolve => {
    window.Dropbox.choose({
      success: files => {
        resolve(files);
      },
      cancel: () => {
        resolve();
      },
      linkType: 'direct',
      multiselect: false,
      extensions: acceptedExtensions.map(ext => {
        // dropbox requires a fullstop at the start of extension
        return `.${ext}`;
      }),
    });
  });
};

function* uploadDropboxWatcher() {
  yield takeLatest(UPLOAD_DROPBOX, uploadDropboxWorker);
}

export function* uploadDropboxWorker(): Generator<*, *, *> {
  if (!isDropboxReady()) {
    yield call(loadDropbox);
  }
  const files = yield call(dropboxChoose);
  if (files) {
    const id = yield call(createExperimentId);
    if (!id) {
      yield put(
        showNotification({
          category: NotificationCategories.ERROR,
          content: 'Unable to create new upload',
          autoHide: false,
        })
      );
      return;
    }
    const file = {
      name: files[0].name,
      path: files[0].link,
      provider: 'dropbox',
    };
    yield put(
      updateExperimentFile({
        id,
        file,
      })
    );
  }
}

export function* uploadDropboxSaga(): Generator<*, *, *> {
  yield all([fork(uploadDropboxWatcher)]);
}
