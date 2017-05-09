/* @flow */

import { push } from 'react-router-redux';

import * as ActionTypes from '../constants/ActionTypes';
import * as NotificationCategories from '../constants/NotificationCategories';
import {showNotification} from './NotificationActions';
import UploadService from '../services/upload/UploadService';

const AnalyserService = IS_ELECTRON ? require('../services/analyser/AnalyserServiceElectron') : require('../services/analyser/AnalyserService');

// $FlowFixMe: Ignore missing require().default
const analyserService = new AnalyserService();
const uploadService = new UploadService();

export function monitorUpload() {
  return (dispatch: Function, getState: Function) => {
    uploadService.uploadFile
      .on('prepare', (filename) => {
        dispatch(analyseFilePrepare(filename));
      })
      .on('upload', () => {
        dispatch(analyseFileUpload());
      })
      .on('progress', (progress) => {
        dispatch(analyseFileProgress(progress));
      })
      .on('done', (file: File) => {
        dispatch(analyseFile(file, uploadService.getId()));
      })
      .on('error', (error) => {
        dispatch(analyseFileError(error));
      });
  };
}

function analyseFilePrepare(filename: string) {
  return (dispatch: Function, getState: Function) => {
    return uploadService.prepare()
      .then((experiment) => {
        dispatch({
          type: ActionTypes.ANALYSE_FILE_PREPARE,
          filename,
          id: experiment.id
        });
        dispatch(push(`/sample/${experiment.id}`));
      })
      .catch((error) => {
        dispatch(analyseFileError(error));
      });
  };
}

function analyseFileUpload() {
  return {
    type: ActionTypes.ANALYSE_FILE_UPLOAD
  };
}

function analyseFile(file: File, id: string) {
  return (dispatch: Function, getState: Function) => {
    if (IS_ELECTRON) {
      // $FlowFixMe: Ignore Electron require
      const {app} = require('electron').remote;
      if (file.path) {
        app.addRecentDocument(file.path);
      }
    }

    dispatch({
      type: ActionTypes.ANALYSE_FILE_ANALYSE
    });

    analyserService.analyseFile(file, id)
      .on('progress', (progress) => {
        dispatch(analyseFileProgress(progress));
      })
      .on('done', (result) => {
        const {json, transformed} = result;
        dispatch(analyseFileSuccess(file.name, json, transformed));
      })
      .on('error', (error) => {
        dispatch(analyseFileError(error.description));
      });
  };
}

export function analyseFileCancel() {
  uploadService.uploadFile.cancel();
  return {
    type: ActionTypes.ANALYSE_FILE_CANCEL
  };
}

function analyseFileSuccess(filename: string, json: Object, transformed: Object) {
  return (dispatch: Function, getState: Function) => {
    dispatch(showNotification({
      category: NotificationCategories.SUCCESS,
      content: `Sample ${filename} analysis complete`
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
    return uploadService.prepare()
      .then((experiment) => {
        dispatch(push(`/sample/${experiment.id}`));
        uploadService.uploadRemoteFile(file)
          .then((data) => {
            dispatch({
              type: ActionTypes.ANALYSE_FILE_ANALYSE,
              filename: file.name,
              id: experiment.id
            });
            analyserService.analyseRemoteFile(file)
            .on('progress', (progress) => {
              dispatch(analyseFileProgress(progress));
            })
            .on('done', (result) => {
              const {json, transformed} = result;
              dispatch(analyseFileSuccess(file.name, json, transformed));
            })
            .on('error', (error) => {
              dispatch(analyseFileError(error.description));
            });
          });
      })
      .catch((error) => {
        dispatch(analyseFileError(error));
      });
  };
}

export function fetchExperiment(id: string) {
  return (dispatch: Function, getState: Function) => {
    analyserService.fetchExperiment(id)
      .then((result) => {
        const {json, transformed} = result;
        dispatch({
          type: ActionTypes.ANALYSE_FILE_SUCCESS,
          json,
          transformed
        });
      })
      .catch((error) => {
        dispatch(analyseFileError(error));
      });
  };
}
