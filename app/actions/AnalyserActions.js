import { push } from 'react-router-redux';

import * as ActionTypes from 'constants/ActionTypes';
import MykrobeService from 'api/MykrobeService';

export function analyseFileWithPath(filePath) {
  return (dispatch, getState) => {
    dispatch(analyseFile(filePath));
    // const { analyser } = getState();
    if (this.analyser) {
      this.analyser.cancel();
    }

    dispatch(push('/analysing'));

    const service = new MykrobeService();
    this.analyser = service.analyseFileWithPath(filePath)
      .on('progress', (progress) => {
        console.log('progress', progress);
        const percent = Math.round(100 * progress.progress / progress.total);
        dispatch(analyseFileProgress(percent));
      })
      .on('done', (json) => {
        dispatch(push('/predictor'));
        dispatch(analyseFileSuccess(json));
      })
      .on('error', (error) => {
        dispatch(push('/'));
        dispatch(errorAnalyseFile(error));
      });
  };
}

export function analyseFileCancel() {
  return (dispatch, getState) => {
    if (this.analyser) {
      this.analyser.cancel();
      this.analyser = null;
    }
    dispatch(push('/'));
    dispatch({
      type: ActionTypes.ANALYSE_FILE_CANCEL
    });
  };
}

function analyseFile(filePath) {
  return {
    type: ActionTypes.ANALYSE_FILE,
    filePath
  };
}

export function analyseFileSuccess(json) {
  return {
    type: ActionTypes.ANALYSE_FILE_SUCCESS,
    json
  };
}

function analyseFileProgress(progress) {
  return {
    type: ActionTypes.ANALYSE_FILE_PROGRESS,
    progress
  };
}

function errorAnalyseFile(error) {
  return {
    type: ActionTypes.ANALYSE_FILE_ERROR,
    error
  };
}
