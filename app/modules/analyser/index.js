/* @flow */

import { combineReducers } from 'redux';
import analyser from './analyser';

export {
  getAnalyser,
  getIsAnalysing,
  getTransformed,
  getProgress,
  monitorUpload,
  analyseFile,
  analyseFileCancel,
  analyseRemoteFile,
  requestExperiment,
  analyseFileNew,
  analyseFileSave,
} from './analyser';

const reducer = combineReducers({
  analyser,
});

export default reducer;
