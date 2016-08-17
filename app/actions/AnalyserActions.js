import * as types from '../constants/ActionTypes';

import MykrobeService from '../api/MykrobeService';

export function analyseFileWithPath(filePath) {
  return (dispatch, getState) => {
    dispatch(analyseFile(filePath));
    // const { analyser } = getState();
    if (this.analyser) {
      this.analyser.cancel();
    }

    const service = new MykrobeService();
    this.analyser = service.analyseFileWithPath(filePath)
      .on('progress', (progress) => {
        console.log('progress', progress);
        const percent = Math.round(100 * progress.progress / progress.total);
        dispatch(analyseFileProgress(percent));
      })
      .on('done', (json) => {
        dispatch(analyseFileSuccess(json));
      })
      .on('error', (error) => {
        dispatch(errorAnalyseFile(error));
      });
  };
}

// TODO: cancel

function analyseFile(filePath) {
  return {
    type: types.ANALYSE_FILE,
    filePath
  };
}

function analyseFileSuccess(json) {
  return {
    type: types.ANALYSE_FILE_SUCCESS,
    json
  };
}

function analyseFileProgress(progress) {
  return {
    type: types.ANALYSE_FILE_PROGRESS,
    progress
  };
}

function errorAnalyseFile(error) {
  return {
    type: types.ANALYSE_FILE_ERROR,
    error
  };
}
