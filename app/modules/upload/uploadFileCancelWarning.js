/* @flow */

import { all, fork, takeEvery, apply } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';

import {
  RESUMABLE_UPLOAD_ERROR,
  RESUMABLE_UPLOAD_DONE,
} from './util/ResumableUpload';

import {
  UPLOAD_FILES,
  UPLOAD_FILE_DROP,
  UPLOAD_FILES_CANCEL,
} from './uploadFile';

export const _warn = (e: any) => {
  e.preventDefault();
  const confirmationMessage = 'Unfinished upload in progress - are you sure?';
  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  return confirmationMessage;
};

function* addWarningWatcher() {
  yield takeEvery([UPLOAD_FILE_DROP, UPLOAD_FILES], function* () {
    yield apply(window, 'addEventListener', ['beforeunload', _warn]);
  });
}

function* removeWarningWatcher() {
  yield takeEvery(
    [UPLOAD_FILES_CANCEL, RESUMABLE_UPLOAD_DONE, RESUMABLE_UPLOAD_ERROR],
    function* () {
      yield apply(window, 'removeEventListener', ['beforeunload', _warn]);
    }
  );
}

export function* uploadFileCancelWarningSaga(): Saga {
  yield all([fork(addWarningWatcher), fork(removeWarningWatcher)]);
}
