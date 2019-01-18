/* @flow */

import path from 'path';
import os from 'os';
import log from 'electron-log';

import * as TargetConstants from '../../../constants/TargetConstants';

const app = require('electron').remote.app;
const platform = os.platform(); // eslint-disable-line global-require
const arch = os.arch();

const dirToBin = () => {
  const rootDir =
    process.env.NODE_ENV === 'development' ? process.cwd() : app.getAppPath();
  log.info('rootDir', rootDir);

  let dirToBin = '';

  if (process.env.NODE_ENV === 'development') {
    dirToBin = path.join(
      rootDir,
      `desktop/resources/bin/${
        TargetConstants.TARGET_NAME
      }/${platform}-${arch}/bin`
    );
  } else {
    dirToBin = path.join(rootDir, '../bin');
  }
  log.info('dirToBin', dirToBin);
  return dirToBin;
};

const pathToBin = () => {
  const UnsupportedError = new Error({
    message: 'Unsupported configuration',
    config: TargetConstants,
  });

  const dirToBinVal = dirToBin();

  let pathToBin = '';

  if (TargetConstants.SPECIES_TB === TargetConstants.SPECIES) {
    pathToBin = path.join(
      dirToBinVal,
      platform === 'win32' ? 'mykrobe_atlas.exe' : 'mykrobe_atlas'
    );
  } else {
    // unsupported configuration
    throw UnsupportedError;
  }

  log.info('pathToBin', pathToBin);

  return pathToBin;
};

export default pathToBin;
