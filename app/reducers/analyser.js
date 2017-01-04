/* @flow */

import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  analysing: false,
  error: null,
  progress: 0,
  file: null,
  json: null,
  transformed: null
};

export default function analyser(state: Object = initialState, action: Object = {}) {
  switch (action.type) {
    case ActionTypes.ANALYSE_FILE:
      return {
        ...initialState,
        file: action.file,
        analysing: true
      };
    case ActionTypes.ANALYSE_FILE_CANCEL:
      return initialState;
    case ActionTypes.ANALYSE_FILE_PROGRESS:
      return {
        ...state,
        progress: action.progress
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
