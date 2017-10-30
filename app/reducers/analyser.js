/* @flow */

import * as ActionTypes from '../constants/ActionTypes';

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

export default function analyser(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case ActionTypes.ANALYSE_FILE_PREPARE:
      return {
        ...initialState,
        step: 0,
        stepDescription: 'Preparing',
        filename: action.filename,
        id: action.id,
        analysing: true,
      };
    case ActionTypes.ANALYSE_FILE_UPLOAD:
      return {
        ...state,
        step: 1,
        stepDescription: 'Uploading',
      };
    case ActionTypes.ANALYSE_FILE_ANALYSE:
      return {
        ...state,
        step: 2,
        stepDescription: 'Analysing',
        analysing: true,
        analyser: action.analyser,
      };
    case ActionTypes.ANALYSE_FILE_CANCEL:
    case ActionTypes.ANALYSE_FILE_NEW:
      return initialState;
    case ActionTypes.ANALYSE_FILE_PROGRESS: {
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
    case ActionTypes.ANALYSE_FILE_SUCCESS:
      return {
        ...state,
        analysing: false,
        analyser: null,
        json: action.json,
        transformed: action.transformed,
      };
    case ActionTypes.ANALYSE_FILE_ERROR:
      return {
        ...initialState,
        error: action.error,
      };
    default:
      return state;
  }
}
