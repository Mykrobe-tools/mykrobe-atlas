/* @flow */

// Handles analysing a local file
// Currently either using local atlas when Electron / Desktop
// Or uploading file if web
// TODO: Would benefit from refactor and clearer separation of concerns
// remove reducer and state from specific local / remote analysers; just dispatch actions into shared state

import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import parsePath from 'parse-filepath';

import UploadService from '../../services/upload/UploadService';
import AnalyserService from '../../services/analyser/AnalyserService';
import * as UIHelpers from '../../helpers/UIHelpers'; // eslint-disable-line import/namespace

import {
  showNotification,
  hideAllNotifications,
  NotificationCategories,
} from '../notifications';

const analyserService = new AnalyserService();
const uploadService = new UploadService();

export const typePrefix = 'analyser/analyser/';

export const PREPARE = `${typePrefix}PREPARE`;
export const UPLOAD = `${typePrefix}UPLOAD`;
export const ANALYSE = `${typePrefix}ANALYSE`;
export const ERROR = `${typePrefix}ERROR`;
export const SUCCESS = `${typePrefix}SUCCESS`;
export const PROGRESS = `${typePrefix}PROGRESS`;
export const CANCEL = `${typePrefix}CANCEL`;
export const NEW = `${typePrefix}NEW`;
export const SAVE = `${typePrefix}SAVE`;

// Selectors

export const getState = state => state.analyser.analyser;

export const getAnalyser = createSelector(getState, analyser => analyser);

export const getIsAnalysing = createSelector(
  getState,
  analyser => analyser.analysing
);

export const getTransformed = createSelector(
  getState,
  analyser => analyser.transformed
);

// Action creators

function analyseFileUpload() {
  return {
    type: UPLOAD,
  };
}

function analyseFileProgress(progress: number) {
  return {
    type: PROGRESS,
    progress,
  };
}

// Reducer

const initialState = {
  analysing: false,
  id: null,
  filename: null,
  step: 0,
  stepDescription: null,
  error: null,
  progress: 0,
  json: null,
  transformed: null,
  analyser: null,
};

export default function reducer(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case PREPARE:
      return {
        ...initialState,
        step: 0,
        stepDescription: 'Preparing',
        filename: action.filename,
        id: action.id,
        analysing: true,
      };
    case UPLOAD:
      return {
        ...state,
        step: 1,
        stepDescription: 'Uploading',
      };
    case ANALYSE:
      return {
        ...state,
        step: 2,
        stepDescription: 'Analysing',
        analysing: true,
        analyser: action.analyser,
      };
    case CANCEL:
    case NEW:
      return initialState;
    case PROGRESS: {
      if (IS_ELECTRON) {
        const { progress, total } = action.progress;
        return {
          ...state,
          progress: Math.round(100 * progress / total),
        };
      } else {
        const progress = Math.max(
          state.progress,
          Math.ceil(action.progress / 3 + state.step * 33)
        );
        return {
          ...state,
          progress,
        };
      }
    }
    case SUCCESS:
      return {
        ...state,
        analysing: false,
        analyser: null,
        json: action.json,
        transformed: action.transformed,
      };
    case ERROR:
      return {
        ...initialState,
        error: action.error,
      };
    default:
      return state;
  }
}

// Side effects

export const monitorUpload = () => {
  return (dispatch: Function) => {
    uploadService.uploadFile
      .on('prepare', filename => {
        dispatch(analyseFilePrepare(filename));
      })
      .on('upload', () => {
        dispatch(analyseFileUpload());
      })
      .on('progress', progress => {
        dispatch(analyseFileProgress(progress));
      })
      .on('done', (file: File) => {
        dispatch(analyseFile(file, uploadService.getId()));
      })
      .on('error', error => {
        dispatch(analyseFileError(error));
      });
  };
};

function analyseFilePrepare(filename: string) {
  return (dispatch: Function) => {
    return uploadService
      .prepare()
      .then(experiment => {
        dispatch({
          type: PREPARE,
          filename,
          id: experiment.id,
        });
        dispatch(push(`/sample/${experiment.id}`));
      })
      .catch(error => {
        dispatch(analyseFileError(error));
      });
  };
}

export const analyseFile = (file: File | string, id?: string) => {
  return (dispatch: Function) => {
    if (IS_ELECTRON) {
      // $FlowFixMe: Ignore Electron require
      const { app } = require('electron').remote;
      if (file.path) {
        app.addRecentDocument(file.path);
      }
    }

    const analyser = analyserService
      .analyseFile(file, id)
      .on('progress', progress => {
        dispatch(analyseFileProgress(progress));
      })
      .on('done', result => {
        const { json, transformed } = result;
        dispatch(analyseFileSuccess(file, json, transformed));
        IS_ELECTRON && dispatch(push('/results'));
      })
      .on('error', error => {
        dispatch(analyseFileError(error.description));
      });

    dispatch(hideAllNotifications());

    dispatch({
      type: ANALYSE,
      analyser,
    });

    IS_ELECTRON && dispatch(push('/'));
  };
};

// TODO rename methods

export const analyseFileCancel = () => {
  if (IS_ELECTRON) {
    return (dispatch: Function, getState: Function) => {
      const state = getState();
      if (state.analyser && state.analyser.analyser) {
        state.analyser.analyser.cancel();
      }
      dispatch({
        type: CANCEL,
      });
      dispatch(push('/'));
    };
  }
  uploadService.uploadFile.cancel();
  return {
    type: CANCEL,
  };
};

function analyseFileSuccess(
  file: File | string,
  json: Object,
  transformed: Object
) {
  return (dispatch: Function) => {
    let filename;
    if (typeof file === 'string') {
      filename = file;
    } else {
      filename = file.name;
    }
    const parsed = parsePath(filename);
    dispatch(
      showNotification({
        category: NotificationCategories.SUCCESS,
        content: `Sample ${parsed.basename} analysis complete`,
      })
    );
    // TODO: also send this into an agnostic part of the redux state
    // which can also be used by remote file analyser
    dispatch({
      type: SUCCESS,
      json,
      transformed,
    });
  };
}

function analyseFileError(error: string) {
  return (dispatch: Function) => {
    dispatch(
      showNotification({
        category: NotificationCategories.ERROR,
        content: error,
        autoHide: false,
      })
    );
    if (IS_ELECTRON) {
      // alert(`Error: ${error}`);
      dispatch(push('/'));
    }
    dispatch({
      type: ERROR,
      error,
    });
  };
}

export const analyseRemoteFile = (file: File) => {
  return (dispatch: Function) => {
    return uploadService
      .prepare()
      .then(experiment => {
        dispatch({
          type: PREPARE,
          filename: file.name,
          id: experiment.id,
        });

        dispatch(push(`/sample/${experiment.id}`));

        uploadService.uploadRemoteFile(file).then(() => {
          dispatch({
            type: ANALYSE,
            filename: file.name,
            id: experiment.id,
          });

          analyserService
            .analyseRemoteFile(file)
            .on('progress', progress => {
              dispatch(analyseFileProgress(progress));
            })
            .on('done', result => {
              const { json, transformed } = result;
              dispatch(analyseFileSuccess(file, json, transformed));
            })
            .on('error', error => {
              dispatch(analyseFileError(error.description));
            });
        });
      })
      .catch(error => {
        dispatch(analyseFileError(error));
      });
  };
};

// TODO: split this into separate file
// each separate method - whether a local file or a remote experiment
// should update same redux state

export const fetchExperiment = (id: string) => {
  return (dispatch: Function) => {
    analyserService
      .fetchExperiment(id)
      .then(result => {
        const { json, transformed } = result;
        dispatch({
          type: SUCCESS,
          json,
          transformed,
        });
      })
      .catch(error => {
        dispatch(analyseFileError(error));
      });
  };
};

export const analyseFileNew = () => {
  return (dispatch: Function, getState: Function) => {
    const state = getState();
    if (state.analyser) {
      state.analyser.cancel && state.analyser.cancel();
    }
    dispatch(push('/'));
    dispatch({
      type: NEW,
    });
  };
};

export const analyseFileSave = () => {
  return (dispatch: Function, getState: Function) => {
    if (IS_ELECTRON) {
      const state = getState();
      const fs = require('fs');
      const filePath = UIHelpers.saveFileDialog('mykrobe.json'); // eslint-disable-line import/namespace
      if (filePath) {
        const { analyser } = state;
        const json = JSON.stringify(analyser.json, null, 2);
        fs.writeFile(filePath, json, err => {
          if (err) {
            console.error(err);
          } else {
            console.log('JSON saved to ', filePath);
          }
        });
      }
    }
  };
};
