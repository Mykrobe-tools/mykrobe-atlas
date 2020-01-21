/* @flow */

import path from 'path';
import os from 'os';

const app = require('electron').remote.app;
const platform = os.platform(); // eslint-disable-line global-require
const arch = os.arch();

export const isWindows = platform === 'win32';

export const rootDir = () => {
  const rootDir =
    process.env.NODE_ENV === 'development' ? process.cwd() : app.getAppPath();
  console.log('rootDir', rootDir);
  return rootDir;
};

export const dirToBin = () => {
  const rootDirValue = rootDir();

  let dirToBin;

  if (process.env.NODE_ENV === 'development') {
    dirToBin = path.join(
      rootDirValue,
      `desktop/resources/bin/desktop/${platform}-${arch}/bin`
    );
  } else {
    dirToBin = path.join(rootDirValue, '../bin');
  }
  console.log('dirToBin', dirToBin);
  return dirToBin;
};

export const pathToBin = () => {
  const pathToBin = path.join(
    dirToBin(),
    isWindows ? 'mykrobe_atlas.exe' : 'mykrobe_atlas'
  );
  console.log('pathToBin', pathToBin);
  return pathToBin;
};
