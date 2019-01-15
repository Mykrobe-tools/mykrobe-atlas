/* @flow */

import { exec, execSync } from 'child_process';

const packager = require('electron-packager');
const del = require('del');
const argv = require('minimist')(process.argv.slice(2));
const pkg = require('../package.json');
const path = require('path');

import { updateStaticPackageJson } from './util';

import archPlatArgs from './util/archPlatArgs';

const { platforms, archs } = archPlatArgs();

const icon = path.join(__dirname, `resources/icon/${pkg.targetName}/icon`);

// copy the version number from the main package.json
updateStaticPackageJson();

const DEFAULT_OPTS = {
  dir: path.join(__dirname, 'static'),
  name: pkg.productName,
  icon: icon,
  version: '',
  'extend-info': path.join(__dirname, 'resources/plist/extend-info.plist'),
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
  console.log('Start pack...');
  (async () => {
    try {
      console.log('Building shell...');
      execSync('yarn desktop-build-main', { stdio: [0, 1, 2] });
      console.log('Building renderer...');
      execSync('yarn desktop-build-renderer', { stdio: [0, 1, 2] });
      await del(path.join(__dirname, 'release'));
      console.log('Packaging releases...');
      for (let i = 0; i < platforms.length; i++) {
        const plat = platforms[i];
        for (let j = 0; j < archs.length; j++) {
          const arch = archs[j];
          console.log(`Packing ${plat} ${arch}`);
          const appPaths = await pack(plat, arch);
          console.log(appPaths);
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
  console.log('opts:', JSON.stringify(opts, null, 2));

  const appPaths = await packager(opts);
  return appPaths;
}
