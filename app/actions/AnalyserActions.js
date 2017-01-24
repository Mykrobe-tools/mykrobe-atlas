/* @flow */

import { push } from 'react-router-redux';

import * as ActionTypes from '../constants/ActionTypes';
import * as NotificationCategories from '../constants/NotificationCategories';
import {showNotification} from './NotificationActions';

const MykrobeService = IS_ELECTRON ? require('../api/MykrobeServiceElectron') : require('../api/MykrobeService');

// $FlowFixMe: Ignore missing require().default
const service = new MykrobeService();

export function monitorUpload() {
  return (dispatch: Function, getState: Function) => {
    service.uploader
      .on('check', () => {
        dispatch(analyseFileCheck());
      })
      .on('upload', () => {
        dispatch(analyseFileUpload());
      })
      .on('progress', (progress) => {
        dispatch(analyseFileProgress(progress));
      })
      .on('done', (file: File) => {
        dispatch(analyseFileProcess(file));
      })
      .on('error', (error) => {
        dispatch(analyseFileError(error));
      });
  };
}

function analyseFileCheck() {
  return (dispatch: Function, getState: Function) => {
    dispatch(push('/sample'));
    dispatch({
      type: ActionTypes.ANALYSE_FILE_CHECK
    });
  };
}

function analyseFileUpload() {
  return {
    type: ActionTypes.ANALYSE_FILE_UPLOAD
  };
}

function analyseFileProcess(file: File) {
  return (dispatch: Function, getState: Function) => {
    if (IS_ELECTRON) {
      // $FlowFixMe: Ignore Electron require
      const {app} = require('electron').remote;
      if (file.path) {
        app.addRecentDocument(file.path);
      }
    }

    dispatch({
      type: ActionTypes.ANALYSE_FILE_PROCESS
    });

    service.analyseFile(file)
      .on('progress', (progress) => {
        dispatch(analyseFileProgress(progress));
      })
      .on('done', (result) => {
        const {json, transformed} = result;
        dispatch(analyseFileSuccess(json, transformed));
      })
      .on('error', (error) => {
        dispatch(analyseFileError(error.description));
      });
  };
}

export function analyseFileCancel() {
  service.uploader.cancel();
  return {
    type: ActionTypes.ANALYSE_FILE_CANCEL
  };
}

function analyseFileSuccess(json: Object, transformed: Object) {
  return (dispatch: Function, getState: Function) => {
    dispatch(showNotification({
      category: NotificationCategories.SUCCESS,
      content: 'File analysis complete'
    }));
    dispatch({
      type: ActionTypes.ANALYSE_FILE_SUCCESS,
      json,
      transformed
    });
  };
}

function analyseFileProgress(progress: number) {
  return {
    type: ActionTypes.ANALYSE_FILE_PROGRESS,
    progress
  };
}

function analyseFileError(error: string) {
  return (dispatch: Function, getState: Function) => {
    dispatch(showNotification({
      category: NotificationCategories.ERROR,
      content: error,
      autoHide: false
    }));
    dispatch({
      type: ActionTypes.ANALYSE_FILE_ERROR,
      error
    });
  };
}

export function analyseRemoteFile(file: Object) {
  return (dispatch: Function, getState: Function) => {
    dispatch(push('/sample'));
    dispatch({
      type: ActionTypes.ANALYSE_FILE_PROCESS
    });
    service.analyseRemoteFile(file)
      .on('progress', (progress) => {
        dispatch(analyseFileProgress(progress));
      })
      .on('done', (result) => {
        const {json, transformed} = result;
        dispatch(analyseFileSuccess(json, transformed));
      })
      .on('error', (error) => {
        dispatch(analyseFileError(error.description));
      });
  };
}
