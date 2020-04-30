/* @flow */

// https://github.com/electron-userland/electron-builder

// load process.env from .env file (to set process.env.GH_TOKEN)
require('dotenv').config();

import path from 'path';
import produce from 'immer';
import debug from 'debug';
const glob = require('glob');

const d = debug('mykrobe:desktop-dist');

const builder = require('electron-builder');
const pkg = require('../package.json');

import archPlatArgs from './util/archPlatArgs';
import { fetchPredictorBinariesIfChanged, fetchLatestRelease } from './util';

const argv = require('minimist')(process.argv.slice(2));

d('argv', JSON.stringify(argv, null, 2));

const { platforms, archs } = archPlatArgs();

export const build = async ({ plat, arch, releaseType, publish }) => {
  d('build', JSON.stringify({ plat, arch, releaseType, publish }, null, 2));
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
    const outputDir = path.join(
      __dirname,
      '..',
      pkg.build.directories.output,
      `mac`,
      `${pkg.productName}.app`
    );
    const outputDirBin = path.join(outputDir, `Contents/Resources/bin`);

    draft.extraResources = {
      from: sourceDir,
      to: 'bin',
    };

    // FIXME: .so files are not signed automatically - https://github.com/electron/electron-osx-sign/issues/226
    // have to be full path e.g. /Applications/MAMP/htdocs/mykrobe-atlas/desktop/dist/mac/Mykrobe.app/Contents/Resources/bin/_sha1.cpython-37m-darwin.so

    const additionalFilesToSign = glob.sync(path.join(sourceDir, '/**/*.so'));

    const binaries = additionalFilesToSign.map(sourceFilePath => {
      const filePathRelative = sourceFilePath.substr(sourceDir.length);
      return path.join(outputDirBin, filePathRelative);
    });

    draft.mac.binaries = binaries;

    draft.publish.releaseType = releaseType;
  });

  // specify platform and arch

  const options = produce({ config }, draft => {
    draft[arch] = true;
    draft.publish = publish;
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

  await builder.build(options);
};

export const dist = async () => {
  await fetchPredictorBinariesIfChanged();

  const release = await fetchLatestRelease();
  const releaseType = release.draft
    ? 'draft'
    : release.prerelease
    ? 'prerelease'
    : 'release';

  const publish = argv.publish ? 'always' : 'never';
  // TODO: preflight validate env vars if publish===true

  for (let i = 0; i < platforms.length; i++) {
    const plat = platforms[i];
    for (let j = 0; j < archs.length; j++) {
      const arch = archs[j];
      await build({ plat, arch, releaseType, publish });
    }
  }

  d('Done');
};

(async () => {
  try {
    await dist();
  } catch (e) {
    d(e);
    d('Failed');
  }
})();
