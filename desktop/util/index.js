/* @flow */

import { execSync } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs-extra';

import debug from 'debug';
const d = debug('mykrobe:desktop-util');

const pkg = require('../../package.json');

export const arch = os.arch();
export const plat = os.platform();

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
  d(command);
  execSync(command, { stdio: [0, 1, 2] });
};

export const updateStaticPackageJson = () => {
  const staticPackageJson = require('../static/package.json');
  staticPackageJson.targetName = pkg.targetName;
  staticPackageJson.description = pkg.description;
  staticPackageJson.productName = pkg.productName;
  staticPackageJson.version = pkg.version;

  const versionPath = path.join(
    __dirname,
    '../mykrobe-binaries/Mykrobe-predictor/VERSION'
  );
  const exists = fs.existsSync(versionPath);
  if (exists) {
    const version = fs.readFileSync(versionPath, 'utf8');
    staticPackageJson.executableVersion = version.trim();
  } else {
    delete staticPackageJson.executableVersion;
  }

  const json = JSON.stringify(staticPackageJson, null, 2);
  const filePath = path.join(__dirname, '../static/package.json');
  fs.writeFileSync(filePath, json);
};
