/* @flow */

import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  analysing: false,
  step: 0,
  error: null,
  progress: 0,
  json: null,
  transformed: null
};

export default function analyser(state: Object = initialState, action: Object = {}) {
  switch (action.type) {
    case ActionTypes.ANALYSE_FILE_CHECK:
      return {
        ...initialState,
        step: 0,
        analysing: true
      };
    case ActionTypes.ANALYSE_FILE_UPLOAD:
      return {
        ...state,
        step: 1,
        analysing: true
      };
    case ActionTypes.ANALYSE_FILE_PROCESS:
      return {
        ...state,
        step: 2,
        analysing: true
      };
    case ActionTypes.ANALYSE_FILE_CANCEL:
      return initialState;
    case ActionTypes.ANALYSE_FILE_PROGRESS:
      const progress = Math.max(state.progress, Math.ceil((action.progress / 3) + (state.step * 33)));
      return {
        ...state,
        progress
      };
    case ActionTypes.ANALYSE_FILE_SUCCESS:
      return {
        ...state,
        analysing: false,
        json: action.json,
        transformed: action.transformed
      };
    case ActionTypes.ANALYSE_FILE_ERROR:
      return {
        ...state,
        analysing: false,
        error: action.error
      };
    default:
      return state;
  }
}
