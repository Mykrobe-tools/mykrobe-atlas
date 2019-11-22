/* @flow */

// https://github.com/electron-userland/electron-builder

import path from 'path';
import produce from 'immer';
import debug from 'debug';

const d = debug('mykrobe:desktop-dist');

const builder = require('electron-builder');
const pkg = require('../package.json');

import archPlatArgs from './util/archPlatArgs';

const argv = require('minimist')(process.argv.slice(2));

d('argv', JSON.stringify(argv, null, 2));

const { platforms, archs } = archPlatArgs();

const build = (plat, arch) => {
  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') {
    return;
  }

  const config = produce(pkg.build, draft => {
    // include the bin folder
    const sourceDir = path.join(
      __dirname,
      `resources/bin/${pkg.targetName}/${plat}-${arch}/bin`
    );

    draft.extraResources = {
      from: sourceDir,
      to: 'bin',
    };
  });

  // specify platform and arch

  const options = produce({ config }, draft => {
    draft[arch] = true;
    draft.publish = argv.publish ? 'always' : 'never';
    switch (plat) {
      case 'darwin':
        draft.mac = [];
        break;
      case 'win32':
        draft.win = [];
        break;
      case 'linux':
        draft.linux = [];
        break;
    }
  });

  d('options', JSON.stringify(options, null, 2));

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
    d('done');
  })
  .catch(error => {
    console.error(error);
  });
