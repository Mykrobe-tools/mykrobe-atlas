/* @flow */

import path from 'path';
import fs from 'fs-extra';

const pkg = require('../../package.json');

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
