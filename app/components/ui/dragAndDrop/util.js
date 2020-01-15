/* @flow */

import { extensionForFileName } from '../../../util';

export const shouldAcceptDropEvent = (e: any) => {
  const dt = e.dataTransfer;
  if (
    !(
      dt.types &&
      (dt.types.indexOf
        ? dt.types.indexOf('Files') !== -1
        : dt.types.contains('Files'))
    )
  ) {
    return false;
  }
  return true;
};

export const shouldAcceptDropEventForExtensions = (
  e: any,
  accept: Array<*>
) => {
  if (!shouldAcceptDropEvent(e)) {
    return false;
  }
  for (let i = 0; i < e.dataTransfer.files.length; i++) {
    const file = e.dataTransfer.files[i];
    const extension = extensionForFileName(file.name);
    if (!accept.includes(extension)) {
      return false;
    }
  }
  return true;
};
