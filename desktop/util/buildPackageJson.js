/* @flow */

import path from 'path';
import fs from 'fs-extra';

const pkg = require('../../package.json');

export const updateBuildPackageJson = (extra: any) => {
  const packageJson = require('../resources/package.json');
  packageJson.targetName = pkg.targetName;
  packageJson.description = pkg.description;
  packageJson.productName = pkg.productName;
  packageJson.version = pkg.version;

  if (extra) {
    Object.assign(packageJson, { ...extra });
  }

  const json = JSON.stringify(packageJson, null, 2);
  const buildPath = path.join(__dirname, '../build');
  const filePath = path.join(buildPath, 'package.json');
  fs.ensureDirSync(buildPath);
  fs.writeFileSync(filePath, json);
};
