import * as ActionTypes from 'constants/ActionTypes';
import fetch from 'isomorphic-fetch';

export function loadTreeWithPath(filePath) {
  return (dispatch, getState) => {
    dispatch(loadTree(filePath));
    return fetch(`http://localhost:3000/demo/${filePath}`)
    .then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(loadTreeSuccess(json));
        });
      }
      else {
        return Promise.reject(response.statusText);
      }
    });
  };
}

function loadTree(filePath) {
  return {
    type: ActionTypes.LOAD_TREE,
    filePath
  };
}

function loadTreeSuccess(json) {
  return {
    type: ActionTypes.LOAD_TREE_SUCCESS,
    json
  };
}

export function loadSamplesWithPath(filePath) {
  return (dispatch, getState) => {
    dispatch(loadSamples(filePath));
    return fetch(`http://localhost:3000/demo/${filePath}`)
    .then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch(loadSamplesSuccess(json));
        });
      }
      else {
        return Promise.reject(response.statusText);
      }
    });
  };
}

function loadSamples(filePath) {
  return {
    type: ActionTypes.LOAD_SAMPLES,
    filePath
  };
}

function loadSamplesSuccess(json) {
  return {
    type: ActionTypes.LOAD_SAMPLES_SUCCESS,
    json
  };
}
