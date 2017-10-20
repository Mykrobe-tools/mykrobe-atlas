/* @flow */

import os from 'os';

export const escapePath = unescaped => {
  if (os.platform() === 'darwin') {
    return unescaped.replace(/(\s)/g, '\\ ');
  }
  return unescaped;
};
