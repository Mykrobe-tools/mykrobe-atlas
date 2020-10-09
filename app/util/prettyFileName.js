/* @flow */

import { isString } from 'makeandship-js-common/src/utils/is';

import { API_SAMPLE_EXTENSIONS_ARRAY } from '../constants/APIConstants';

const prettyFileName = (fileName: string) => {
  if (!isString(fileName)) {
    return;
  }

  let elements = fileName.split('.');
  if (elements.length === 0) {
    return;
  }

  // find the last element ending with a digit which directly preceeds a valid extension
  let searching = true;
  let element;

  // pop elements that are valid extensions
  while (searching && elements.length > 0) {
    element = elements[elements.length - 1];
    if (API_SAMPLE_EXTENSIONS_ARRAY.includes(element.toLowerCase())) {
      elements.pop();
    } else {
      searching = false;
    }
  }

  if (elements.length === 0) {
    return;
  }

  return elements.join('.');
};

export default prettyFileName;
