/* @flow */

import { all, fork } from 'redux-saga/effects';

import { uploadSaga } from './upload';
import { uploadDropboxSaga } from './uploadDropbox';

export {
  uploadFileAssignDrop,
  uploadFileAssignBrowse,
  uploadFileUnassignDrop,
  uploadSaga,
} from './upload';

export { uploadDropbox, uploadDropboxSaga } from './uploadDropbox';

export function* rootUploadSaga(): Generator<*, *, *> {
  yield all([fork(uploadSaga), fork(uploadDropboxSaga)]);
}
