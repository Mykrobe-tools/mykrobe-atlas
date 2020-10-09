/* @flow */

const fs = require('fs');
const path = require('path');

import detectFileSeqForFileNameInArray from '../../../util/detectFileSeqForFileNameInArray';

export const detectFileSeqForFilePathInDir = (
  filePath: string,
  dir: Array<string>
) => {
  const seqName = detectFileSeqForFileNameInArray(path.basename(filePath), dir);
  if (seqName) {
    return path.join(path.dirname(filePath), seqName);
  }
};

const detectFileSeq = (filePath: string) => {
  const dir = fs.readdirSync(path.dirname(filePath));
  return detectFileSeqForFilePathInDir(filePath, dir);
};

export default detectFileSeq;
