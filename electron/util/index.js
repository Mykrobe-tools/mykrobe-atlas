/* @flow */

import { execSync } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs-extra';

const pkg = require('../../package.json');

export const INCLUDE_SLOW_TESTS =
  process.env.INCLUDE_SLOW_TESTS && process.env.INCLUDE_SLOW_TESTS === 'true';

export const arch = os.arch();
export const plat = os.platform();

export const ELECTRON_EXECUTABLE_PATH =
  plat === 'win32'
    ? path.join(__dirname, '../dist/win-unpacked', `${pkg.productName}.exe`)
    : path.join(
        __dirname,
        '../dist/mac',
        `${pkg.productName}.app`,
        `Contents/MacOS/${pkg.productName}`
      );

// export const BAM_FOLDER_PATH = `${process.env.HOME}/Dropbox/bams/`;
export const BAM_FOLDER_PATH = path.join(
  __dirname,
  '../../test/__fixtures__/bams'
);

const ENV_HOME = process.env.HOME;
const IS_CYGWIN = !!/cygwin/.test(ENV_HOME);

export const escapePath = unescaped => {
  if (os.platform() === 'darwin') {
    return unescaped.replace(/(\s)/g, '\\ ');
  }
  return unescaped;
};

export const executeCommand = command => {
  if (IS_CYGWIN) {
    command =
      ENV_HOME.replace(/(cygwin[0-9]*).*/, '$1') +
      '\\bin\\bash.exe -c "' +
      command.replace(/\\/g, '/').replace(/"/g, '\\"') +
      '"';
  }
  console.log(command);
  execSync(command, { stdio: [0, 1, 2] });
};

export const ensureBams = () => {
  const exists = fs.existsSync(BAM_FOLDER_PATH);
  if (!exists) {
    throw `No bam folder found at '${
      BAM_FOLDER_PATH
    }' - Please see README.md and download bam folder before running this test`;
  }
};

export const ensurePredictorBinaries = () => {
  const binFolder = path.join(
    __dirname,
    `../resources/bin/${pkg.targetName}/${plat}-${arch}/bin`
  );
  const executableName =
    plat === 'win32' ? 'mykrobe_predictor.exe' : 'mykrobe_predictor';
  const executablePath = path.join(binFolder, executableName);
  console.log(`Checking for existence of '${executablePath}'`);
  const exists = fs.existsSync(executablePath);

  // check for existence of binary and bail with error
  if (!exists) {
    throw `No executable found at '${
      executablePath
    }' - Please run 'yarn build-predictor-binaries' before running this test`;
  }
};
