/* @flow */

import { all, fork, put, call, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import loadScript from 'load-script';

import config from '../../config';

const BOX_SDK_URL = 'https://cdn01.boxcdn.net/js/static/select.js';

import { updateExperimentProvider, createExperimentId } from '../experiments';

const acceptedExtensions = ['json', 'bam', 'gz', 'fastq', 'jpg'];

export const typePrefix = 'upload/uploadBox/';

export const UPLOAD_BOX = `${typePrefix}UPLOAD_BOX`;

// Actions

export const uploadBox = () => ({
  type: UPLOAD_BOX,
});

// Side effects

const options = {
  clientId: config.BOX_CLIENT_ID,
  linkType: 'direct',
  multiselect: 'false',
};

const isBoxReady = () => {
  return !!window.BoxSelect;
};

const loadBox = async () => {
  return new Promise((resolve, reject) => {
    loadScript(BOX_SDK_URL, error => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
};

const boxChoose = async () => {
  return new Promise(resolve => {
    const boxSelect = new window.BoxSelect(options);
    boxSelect.success(files => {
      resolve(files);
    });
    boxSelect.cancel(() => {
      resolve();
    });
    boxSelect.launchPopup();
  });
};

function* uploadBoxWatcher() {
  yield takeLatest(UPLOAD_BOX, uploadBoxWorker);
}

export function* uploadBoxWorker(): Generator<*, *, *> {
  const files = yield call(boxChoose);
  if (!files) {
    return;
  }
  const experimentId = yield call(createExperimentId);
  if (!experimentId) {
    return;
  }
  const experimentFile = {
    name: files[0].name,
    path: files[0].url,
    provider: 'box',
  };
  yield put(
    updateExperimentProvider({
      id: experimentId,
      file: experimentFile,
    })
  );
}

export function* uploadBoxSaga(): Generator<*, *, *> {
  if (!isBoxReady()) {
    yield call(loadBox);
  }
  yield all([fork(uploadBoxWatcher)]);
}
