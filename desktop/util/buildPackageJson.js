/* @flow */

import path from 'path';
import fs from 'fs-extra';

const pkg = require('../../package.json');

import { getCurrentPredictorBinariesVersion } from './predictorBinaries';

export const updateBuildPackageJson = (extra: any) => {
  const packageJson = require('../resources/package.json');
  packageJson.name = pkg.name;
  packageJson.targetName = pkg.targetName;
  packageJson.description = pkg.description;
  packageJson.productName = pkg.productName;
  packageJson.version = pkg.version;
  packageJson.author = pkg.author;
  packageJson.license = pkg.license;

  const executableVersion = getCurrentPredictorBinariesVersion();
  if (executableVersion) {
    packageJson.executableVersion = executableVersion;
  }

  if (extra) {
    Object.assign(packageJson, { ...extra });
  }

  const json = JSON.stringify(packageJson, null, 2);
  const buildPath = path.join(__dirname, '../build');
  const filePath = path.join(buildPath, 'package.json');
  fs.ensureDirSync(buildPath);
  fs.writeFileSync(filePath, json);
};
