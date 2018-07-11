/* @flow */

import { all, fork } from 'redux-saga/effects';
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
} from './localAtlas';

const desktopReducer = combineReducers({
  localAtlas,
});

export default desktopReducer;

export function* rootDesktopSaga(): Generator<*, *, *> {
  yield all([fork(localAtlasSaga)]);
}
