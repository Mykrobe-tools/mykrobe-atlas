/* @flow */

import { push } from 'react-router-redux';

import * as ActionTypes from '../constants/ActionTypes';
import * as NotificationCategories from '../constants/NotificationCategories';
import {showNotification} from './NotificationActions';

const MykrobeService = IS_ELECTRON ? require('../api/MykrobeServiceElectron') : require('../api/MykrobeService');
console.log('MykrobeService', MykrobeService);

export function analyseFile(file: File) {
  return (dispatch: Function, getState: Function) => {
    if (this.analyser) {
      this.analyser.cancel();
    }

    dispatch(push('/'));

    if (IS_ELECTRON) {
      const {app} = require('electron').remote;
      if (file.path) {
        app.addRecentDocument(file.path);
      }
    }

    dispatch({
      type: ActionTypes.ANALYSE_FILE,
      file
    });

    const service = new MykrobeService();
    this.analyser = service.analyseFile(file)
      .on('progress', (progress) => {
        // console.log('progress', progress);
        const percent = Math.round(100 * progress.progress / progress.total);
        dispatch(analyseFileProgress(percent));
      })
      .on('done', (result) => {
        const {json, transformed} = result;
        dispatch(push('/results'));
        dispatch(analyseFileSuccess(json, transformed));
      })
      .on('error', (error) => {
        dispatch(push('/'));
        dispatch(errorAnalyseFile(error));
        dispatch(showNotification({
          category: NotificationCategories.ERROR,
          content: error.description,
          autoHide: false
        }));
      });
  };
}

export function analyseFileCancel() {
  return (dispatch: Function, getState: Function) => {
    if (this.analyser) {
      this.analyser.cancel();
      delete this.analyser;
    }
    dispatch(push('/'));
    dispatch({
      type: ActionTypes.ANALYSE_FILE_CANCEL
    });
  };
}

export function analyseFileSuccess(json: Object, transformed: Object) {
  return {
    type: ActionTypes.ANALYSE_FILE_SUCCESS,
    json,
    transformed
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
