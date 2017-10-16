/* @flow */

// https://github.com/electron-userland/electron-builder

import path from 'path';
import os from 'os';
const builder = require('electron-builder');
const pkg = require('../package.json');
const argv = require('minimist')(process.argv.slice(2));
const sequential = require('promise-sequential');

console.log('argv', JSON.stringify(argv, null, 2));

let archs;
let platforms;

if (argv.all) {
  archs = ['ia32', 'x64'];
  platforms = ['linux', 'win32', 'darwin'];
} else {
  platforms = [];
  archs = ['ia32', 'x64'];
  if (argv.mac) {
    platforms.push('darwin');
  }
  if (argv.win) {
    platforms.push('win32');
    if (argv.x64 && !argv.ia32) {
      archs = ['x64'];
    }
  }
  if (argv.linux) {
    platforms.push('linux');
  }
}

if (!platforms.length) {
  platforms = [os.platform()];
}

if (!archs.length) {
  archs = [os.arch()];
}

console.log('platforms', JSON.stringify(platforms, null, 2));

console.log('archs', JSON.stringify(archs, null, 2));

const build = (plat, arch, cb) => {
  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') {
    return;
  }
  const config = JSON.parse(JSON.stringify(pkg.build));

  // include the bin folder

  const sourceDir = path.resolve(
    __dirname,
    `resources/bin/${pkg.targetName}/${plat}-${arch}/bin`
  );

  config.extraResources = {
    from: sourceDir,
    to: 'bin',
  };

  // specify platform and arch

  let options = {
    config,
    [arch]: true,
  };

  switch (plat) {
    case 'darwin':
      options.mac = [];
      break;
    case 'win32':
      options.win = [];
      break;
    case 'linux':
      options.linux = [];
      break;
  }

  console.log('config', JSON.stringify(config, null, 2));

  return builder.build(options);
};

let builds = [];

platforms.forEach(plat => {
  archs.forEach(arch => {
    builds.push(build(plat, arch));
  });
});

Promise.all(builds)
  .then(() => {
    console.log('done');
  })
  .catch(error => {
    console.error(error);
  });
