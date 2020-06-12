/* @flow */

import { exec, execSync } from 'child_process';
import debug from 'debug';
import fs from 'fs-extra';

const d = debug('mykrobe:desktop-package');

const packager = require('electron-packager');
const del = require('del');
const argv = require('minimist')(process.argv.slice(2));
const pkg = require('../package.json');
const path = require('path');

import { updateBuildPackageJson } from './util';

import archPlatArgs from './util/archPlatArgs';

const { platforms, archs } = archPlatArgs();

const icon = path.join(__dirname, `resources/icon/${pkg.targetName}/icon`);

// clean build folder
const buildDir = path.join(__dirname, 'build');
fs.removeSync(buildDir);
fs.ensureDirSync(buildDir);

// copy the version number from the main package.json
updateBuildPackageJson();

// do not sign app here - signing is handled by dist.js
const DEFAULT_OPTS = {
  dir: buildDir,
  name: pkg.productName,
  icon: icon,
  version: '',
  extendInfo: path.join(__dirname, 'resources/plist/extendInfo.plist'),
  appBundleId: pkg.build.appId,
};

// this is the version of Electron to use
const version = argv.version || argv.v;

if (version) {
  DEFAULT_OPTS.version = version;
  startPack();
} else {
  // use the same version as the currently-installed electron
  exec('npm list electron --json --dev', (error, stdout, stderr) => {
    if (error) {
      console.error('error', error, stderr, stdout);
      DEFAULT_OPTS.version = '1.3.3';
    } else {
      const json = JSON.parse(stdout);
      const version = json.dependencies['electron'].version;
      DEFAULT_OPTS.version = version;
    }
    startPack();
  });
}

function startPack() {
  d('Start pack...');
  (async () => {
    try {
      d('Building shell...');
      execSync('yarn desktop-build-main', { stdio: [0, 1, 2] });
      d('Building renderer...');
      execSync('yarn desktop-build-renderer', { stdio: [0, 1, 2] });
      await del(path.join(__dirname, 'release'));
      d('Packaging releases...');
      for (let i = 0; i < platforms.length; i++) {
        const plat = platforms[i];
        for (let j = 0; j < archs.length; j++) {
          const arch = archs[j];
          d(`Packing ${plat} ${arch}`);
          const appPaths = await pack(plat, arch);
          d(appPaths);
        }
      }
    } catch (err) {
      console.error(err);
    }
  })();
}

async function pack(plat, arch) {
  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') {
    return;
  }

  const iconObj = {
    icon:
      DEFAULT_OPTS.icon +
      (() => {
        let extension = '.png';
        if (plat === 'darwin') {
          extension = '.icns';
        } else if (plat === 'win32') {
          extension = '.ico';
        }
        return extension;
      })(),
  };

  const opts = Object.assign({}, DEFAULT_OPTS, iconObj, {
    platform: plat,
    arch,
    prune: true,
    'app-version': pkg.version || DEFAULT_OPTS.version,
    out: path.join(__dirname, `release/${plat}-${arch}`),
  });
  d('opts:', JSON.stringify(opts, null, 2));

  const appPaths = await packager(opts);
  return appPaths;
}
