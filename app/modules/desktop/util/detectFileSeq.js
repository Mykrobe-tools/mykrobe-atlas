/* @flow */

const fs = require('fs');
const path = require('path');

import { isString, isArray } from 'makeandship-js-common/src/util/is';

export const detectFileSeqForFileNameInDir = (
  fileName: string,
  dir: Array<string>
) => {
  if (!isString(fileName)) {
    return;
  }
  if (!isArray(dir)) {
    return;
  }
  const index = fileName.indexOf('.');
  if (!index) {
    return;
  }
  const name = fileName.substr(0, index);
  const ext = fileName.substr(index);
  const matches = name.match(/(.+)(\d+)$/);
  if (matches && matches.length === 3) {
    const prefix = matches[1];
    const number = parseInt(matches[2]);
    const seqBefore = `${prefix}${number - 1}${ext}`;
    if (dir.includes(seqBefore)) {
      return seqBefore;
    }
    const seqAfter = `${prefix}${number + 1}${ext}`;
    if (dir.includes(seqAfter)) {
      return seqAfter;
    }
  }
};

export const detectFileSeqForFilePathInDir = (
  filePath: string,
  dir: Array<string>
) => {
  const seqName = detectFileSeqForFileNameInDir(path.basename(filePath), dir);
  if (seqName) {
    return path.join(path.dirname(filePath), seqName);
  }
};

const detectFileSeq = (filePath: string) => {
  const dir = fs.readdirSync(path.dirname(filePath));
  return detectFileSeqForFilePathInDir(filePath, dir);
};

export default detectFileSeq;
