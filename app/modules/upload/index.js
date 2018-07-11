/* @flow */

import { all, fork } from 'redux-saga/effects';

import { uploadSaga } from './upload';
import { uploadDropboxSaga } from './uploadDropbox';
import { uploadGoogleDriveSaga } from './uploadGoogleDrive';
import { uploadBoxSaga } from './uploadBox';
import { uploadOneDriveSaga } from './uploadOneDrive';

export {
  uploadFileAssignDrop,
  uploadFileAssignBrowse,
  uploadFileUnassignDrop,
  uploadSaga,
} from './upload';

export { uploadDropbox, uploadDropboxSaga } from './uploadDropbox';
export { uploadGoogleDrive, uploadGoogleDriveSaga } from './uploadGoogleDrive';
export { uploadBox, uploadBoxSaga } from './uploadBox';
export { uploadOneDrive, uploadOneDriveSaga } from './uploadOneDrive';

export function* rootUploadSaga(): Generator<*, *, *> {
  yield all([
    fork(uploadSaga),
    fork(uploadDropboxSaga),
    fork(uploadGoogleDriveSaga),
    fork(uploadBoxSaga),
    fork(uploadOneDriveSaga),
  ]);
}
