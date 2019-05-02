/* @flow */

import path from 'path';
import os from 'os';
import log from 'electron-log';

import * as TargetConstants from '../../../constants/TargetConstants';

const app = require('electron').remote.app;
const platform = os.platform(); // eslint-disable-line global-require
const arch = os.arch();

export const isWindows = platform === 'win32';

export const rootDir = () => {
  const rootDir =
    process.env.NODE_ENV === 'development' ? process.cwd() : app.getAppPath();
  log.info('rootDir', rootDir);
  return rootDir;
};

export const validateTarget = () => {
  const UnsupportedError = new Error({
    message: 'Unsupported configuration',
    config: TargetConstants,
  });

  if (TargetConstants.SPECIES_TB === TargetConstants.SPECIES) {
    // supported
  } else {
    // unsupported configuration
    throw UnsupportedError;
  }
};

export const dirToBin = () => {
  const rootDirValue = rootDir();

  let dirToBin;

  if (process.env.NODE_ENV === 'development') {
    dirToBin = path.join(
      rootDirValue,
      `desktop/resources/bin/${
        TargetConstants.TARGET_NAME
      }/${platform}-${arch}/bin`
    );
  } else {
    dirToBin = path.join(rootDirValue, '../bin');
  }
  log.info('dirToBin', dirToBin);
  return dirToBin;
};

export const pathToBin = () => {
  const pathToBin = path.join(
    dirToBin(),
    isWindows ? 'mykrobe_atlas.exe' : 'mykrobe_atlas'
  );
  log.info('pathToBin', pathToBin);
  return pathToBin;
};

export const pathToMccortex = () => {
  const pathToMccortex = path.join(
    dirToBin(),
    isWindows ? 'mccortex31.exe' : 'mccortex31'
  );
  log.info('pathToMccortex', pathToMccortex);
  return pathToMccortex;
};
