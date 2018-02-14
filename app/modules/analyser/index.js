/* @flow */

import { combineReducers } from 'redux';
import analyser from './analyser';

export {
  getAnalyser,
  getIsAnalysing,
  getTransformed,
  monitorUpload,
  analyseFile,
  analyseFileCancel,
  analyseRemoteFile,
  fetchExperiment,
  analyseFileNew,
  analyseFileSave,
} from './analyser';

const reducer = combineReducers({
  analyser,
});

export default reducer;
