/* @flow */

const fs = require('fs');
const path = require('path');

import { isString, isArray } from 'makeandship-js-common/src/utils/is';

import { API_SAMPLE_EXTENSIONS_ARRAY } from '../../../constants/APIConstants';

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

  let elements = fileName.split('.');
  if (elements.length === 0) {
    return;
  }

  // find the last element ending with a digit which directly preceeds a valid extension
  let searching = true;
  let extensions = [];
  let element;

  // pop elements that are valid extensions
  while (searching && elements.length > 0) {
    element = elements.pop();
    if (API_SAMPLE_EXTENSIONS_ARRAY.includes(element.toLowerCase())) {
      extensions.splice(0, 0, element);
    } else {
      searching = false;
    }
  }

  if (searching || !element || !isString(element)) {
    return;
  }

  // check if next element ends in digit

  const matches = element.match(/(.+)(\d+)$/);

  if (matches && matches.length === 3) {
    const elementPrefix = matches[1];
    const elementNumber = parseInt(matches[2]);

    // recreate filename +/- 1
    const elementBefore = `${elementPrefix}${elementNumber - 1}`;
    const elementAfter = `${elementPrefix}${elementNumber + 1}`;
    const elementsBefore = [...elements, elementBefore, ...extensions];
    const elementsAfter = [...elements, elementAfter, ...extensions];
    const filenameBefore = elementsBefore.join('.');
    const filenameAfter = elementsAfter.join('.');

    if (dir.includes(filenameBefore)) {
      return filenameBefore;
    } else if (dir.includes(filenameAfter)) {
      return filenameAfter;
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
