import * as ActionTypes from 'constants/ActionTypes';
import MykrobeLocalFileAnalyser from 'api/MykrobeLocalFileAnalyser';
import path from 'path';
import fs from 'fs';

export function loadTreeWithPath(filePath) {
  return (dispatch, getState) => {
    dispatch(loadTree(filePath));
    const dirToBin = new MykrobeLocalFileAnalyser().dirToBin();
    const filePathJoined = path.join(dirToBin, filePath);
    fs.readFile(filePathJoined, 'utf8', (err, data) => {
      if (err) throw err;
      const json = JSON.parse(data);
      dispatch(loadTreeSuccess(json));
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
