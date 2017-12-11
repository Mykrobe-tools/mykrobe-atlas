/* @flow */

// https://github.com/electron-userland/electron-builder

import path from 'path';
const builder = require('electron-builder');
const pkg = require('../package.json');

import archPlatArgs from './util/archPlatArgs';

const argv = require('minimist')(process.argv.slice(2));

const { platforms, archs } = archPlatArgs();

const build = (plat, arch) => {
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
    publish: argv.publish ? 'always' : 'never',
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

  console.log('options', JSON.stringify(options, null, 2));

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
