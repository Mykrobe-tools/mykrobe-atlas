import * as types from '../constants/ActionTypes';

const initialState = {
  analysing: false,
  error: false,
  progress: 0,
  filePath: '',
  json: false
};

export default function analyser(state = initialState, action = {}) {
  switch (action.type) {
    case types.ANALYSE_FILE:
      return {
        ...initialState,
        filePath: action.filePath,
        analysing: true
      };
    case types.ANALYSE_FILE_PROGRESS:
      return {
        ...state,
        progress: action.progress
      };
    case types.ANALYSE_FILE_SUCCESS:
      return {
        ...state,
        analysing: false,
        json: action.json
      };
    case types.ANALYSE_FILE_ERROR:
      return {
        ...state,
        analysing: false,
        error: action.error
      };
    default:
      return state;
  }
}
