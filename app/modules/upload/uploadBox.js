/* @flow */

import { all, fork, put, call, takeLatest } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { push } from 'connected-react-router';
import loadScript from 'load-script';

const BOX_SDK_URL = 'https://cdn01.boxcdn.net/js/static/select.js';

import { updateExperimentProvider, createExperimentId } from '../experiments';

export const typePrefix = 'upload/uploadBox/';

export const UPLOAD_BOX = `${typePrefix}UPLOAD_BOX`;

// Actions

export const uploadBox = () => ({
  type: UPLOAD_BOX,
});

// Side effects

const options = {
  clientId: window.env?.REACT_APP_BOX_CLIENT_ID,
  linkType: 'direct',
  multiselect: 'false',
};

const isBoxReady = () => {
  return !!window.BoxSelect;
};

const loadBox = async () => {
  return new Promise((resolve, reject) => {
    loadScript(BOX_SDK_URL, (error) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
};

const boxChoose = async () => {
  return new Promise((resolve) => {
    const boxSelect = new window.BoxSelect(options);
    boxSelect.success((files) => {
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

export function* uploadBoxWorker(): Saga {
  const files = yield call(boxChoose);
  if (!files) {
    return;
  }
  const name = files[0].name;
  const path = files[0].url;
  const experimentId = yield call(createExperimentId, name);
  if (!experimentId) {
    return;
  }
  const experimentFile = {
    name,
    path,
    provider: 'box',
  };
  yield put(
    updateExperimentProvider({
      id: experimentId,
      ...experimentFile,
    })
  );
  yield put(push(`/experiments/${experimentId}`));
}

export function* uploadBoxSaga(): Saga {
  if (!isBoxReady()) {
    yield call(loadBox);
  }
  yield all([fork(uploadBoxWatcher)]);
}
