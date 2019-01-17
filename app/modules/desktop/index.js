/* @flow */

import { all, fork } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { combineReducers } from 'redux';

import localAtlas, { localAtlasSaga } from './localAtlas';

export {
  analyseFileNew,
  analyseFile,
  analyseFileCancel,
  analyseFileSave,
  getIsAnalysing,
  getError,
  getProgress,
  getFileNames,
} from './localAtlas';

const desktopReducer = combineReducers({
  localAtlas,
});

export default desktopReducer;

export function* rootDesktopSaga(): Saga {
  yield all([fork(localAtlasSaga)]);
}
