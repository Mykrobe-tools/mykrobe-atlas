/* @flow */

import { execSync } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs-extra';

export {
  fetchGitHubReleases,
  fetchGitHub,
  gitHubPublishConfig,
} from './gitHub';

import debug from 'debug';
const d = debug('mykrobe:desktop-util');

const pkg = require('../../package.json');

export const arch = os.arch();
export const plat = os.platform();

export const executeCommand = async (command: string) => {
  d(command);
  execSync(command, { stdio: [0, 1, 2] });
};

export const updateStaticPackageJson = (extra: any) => {
  const staticPackageJson = require('../static/package.json');
  staticPackageJson.targetName = pkg.targetName;
  staticPackageJson.description = pkg.description;
  staticPackageJson.productName = pkg.productName;
  staticPackageJson.version = pkg.version;

  if (extra) {
    Object.assign(staticPackageJson, { ...extra });
  }

  const json = JSON.stringify(staticPackageJson, null, 2);
  const filePath = path.join(__dirname, '../static/package.json');
  fs.writeFileSync(filePath, json);
};
