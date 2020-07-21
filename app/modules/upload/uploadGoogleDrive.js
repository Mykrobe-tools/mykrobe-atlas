/* @flow */

import { all, fork, put, call, takeLatest } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { push } from 'connected-react-router';
import loadScript from 'load-script';

const SCOPE = ['https://www.googleapis.com/auth/drive.readonly'];
const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js';

import { updateExperimentProvider, createExperimentId } from '../experiments';

export const typePrefix = 'upload/uploadGoogleDrive/';

export const UPLOAD_GOOGLE_DRIVE = `${typePrefix}UPLOAD_GOOGLE_DRIVE`;

// Actions

export const uploadGoogleDrive = () => ({
  type: UPLOAD_GOOGLE_DRIVE,
});

// Side effects

const isGoogleDriveReady = () => {
  return !!window.google && !!window.google.picker;
};

const loadGoogleDrive = async () => {
  return new Promise((resolve, reject) => {
    loadScript(GOOGLE_SDK_URL, (error) => {
      if (error) {
        reject(error);
      }
      window.gapi.load('auth:picker:client', () => {
        window.gapi.client.load('drive', 'v3', () => {
          resolve();
        });
      });
    });
  });
};

const authoriseApp = async () => {
  return new Promise((resolve) => {
    window.gapi.auth.authorize(
      {
        client_id: window.env?.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
        scope: SCOPE,
        immediate: false,
      },
      (result) => {
        resolve(result);
      }
    );
  });
};

const googleDriveChoose = async (oauthToken: string) => {
  return new Promise((resolve) => {
    const picker = new window.google.picker.PickerBuilder();
    picker.addView(window.google.picker.ViewId.DOCS);
    picker.setOAuthToken(oauthToken);
    picker.setDeveloperKey(window.env?.REACT_APP_GOOGLE_DRIVE_DEVELOPER_KEY);
    picker.setCallback((data) => {
      const action = data[window.google.picker.Response.ACTION];
      if (action === window.google.picker.Action.PICKED) {
        resolve(data);
      }
      if (action === window.google.picker.Action.CANCEL) {
        resolve();
      }
      // ignore other actions
    });
    picker.enableFeature(window.google.picker.Feature.NAV_HIDDEN);
    picker.build().setVisible(true);
  });
};

const executeRequest = async (request) => {
  return new Promise((resolve) => {
    request.execute((response) => {
      resolve(response);
    });
  });
};

function* uploadGoogleDriveWatcher() {
  yield takeLatest(UPLOAD_GOOGLE_DRIVE, uploadGoogleDriveWorker);
}

export function* uploadGoogleDriveWorker(): Saga {
  const token = window.gapi.auth.getToken();
  let oauthToken = token && token.access_token;
  if (!oauthToken) {
    const { access_token } = yield call(authoriseApp);
    oauthToken = access_token;
  }
  const data = yield call(googleDriveChoose, oauthToken);
  if (!data) {
    return;
  }
  const file = data[window.google.picker.Response.DOCUMENTS][0];
  const id = file[window.google.picker.Document.ID];
  const request = window.gapi.client.drive.files.get({
    fileId: id,
  });
  const response = yield call(executeRequest, request);
  const experimentId = yield call(createExperimentId);
  if (!experimentId) {
    return;
  }
  const experimentFile = {
    name: response.name,
    path: `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
    accessToken: window.gapi.auth.getToken().access_token,
    provider: 'googleDrive',
  };
  yield put(
    updateExperimentProvider({
      id: experimentId,
      ...experimentFile,
    })
  );
  yield put(push(`/experiments/${experimentId}`));
}

export function* uploadGoogleDriveSaga(): Saga {
  if (!isGoogleDriveReady()) {
    yield call(loadGoogleDrive);
  }
  yield all([fork(uploadGoogleDriveWatcher)]);
}
