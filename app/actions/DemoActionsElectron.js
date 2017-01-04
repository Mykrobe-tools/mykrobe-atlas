/* @flow */

import * as ActionTypes from '../constants/ActionTypes';
import MykrobeConfig from '../api/MykrobeConfig';
import MykrobeLocalFileAnalyser from '../api/MykrobeLocalFileAnalyser';
import path from 'path';
import fs from 'fs';

export function loadTreeWithPath(filePath: string) {
  return (dispatch: Function, getState: Function) => {
    dispatch(loadTree(filePath));
    const dirToBin = new MykrobeLocalFileAnalyser(new MykrobeConfig()).dirToBin();
    const filePathJoined = path.join(dirToBin, filePath);
    fs.readFile(filePathJoined, 'utf8', (err, data) => {
      if (err) throw err;
      const json = JSON.parse(data);
      dispatch(loadTreeSuccess(json));
    });
  };
}

function loadTree(filePath: string) {
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

export function loadSamplesWithPath(filePath: string) {
  return (dispatch: Function, getState: Function) => {
    dispatch(loadSamples(filePath));
    const dirToBin = new MykrobeLocalFileAnalyser(new MykrobeConfig()).dirToBin();
    const filePathJoined = path.join(dirToBin, filePath);
    fs.readFile(filePathJoined, 'utf8', (err, data) => {
      if (err) throw err;
      const json = JSON.parse(data);
      dispatch(loadSamplesSuccess(json));
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
