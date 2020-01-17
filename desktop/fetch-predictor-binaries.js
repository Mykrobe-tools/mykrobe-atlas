/* @flow */

import download from 'progress-download';
import decompress from 'decompress';
import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';

import debug from 'debug';
const d = debug('mykrobe:desktop-fetch-predictor-binaries');

import { fetchGitHubReleases } from './util/gitHub';
import { updateStaticPackageJson } from './util';

export const getPlatformAssetsForTag = (tag: string): Array<*> => [
  {
    platform: 'darwin-x64',
    name: `mykrobe.command_line.osx.${tag}.tar.gz`,
  },
  {
    platform: 'win32-x64',
    name: `mykrobe.command_line.windows.${tag}.tar.gz`,
  },
];

(async () => {
  const releases = await fetchGitHubReleases({
    owner: 'martinghunt',
    repo: 'mykrobe',
  });
  // use the first release
  const release = releases[0];
  d('GitHub release:', JSON.stringify(release, null, 2));
  const tag = release.tag_name;
  d(`Using release tag ${tag}`);
  const platformAssetsForTag = getPlatformAssetsForTag(tag);
  const downloads = [];
  platformAssetsForTag.forEach(({ platform, name }) => {
    release.assets.forEach(asset => {
      if (asset.name === name) {
        downloads.push({
          platform,
          url: asset.browser_download_url,
          name: asset.name,
        });
      }
    });
  });
  d('downloads', JSON.stringify(downloads, null, 2));
  const tmpObj = tmp.dirSync({ prefix: 'mykrobe-' });
  const tmpDir = path.join(tmpObj.name, 'desktop');
  d('tmpDir', tmpDir);
  for (let i = 0; i < downloads.length; i++) {
    const { platform, url, name } = downloads[i];
    const platformTmpDir = path.join(tmpDir, platform);
    await download(url, platformTmpDir);
    // decompresses into sub-folder 'mykrobe_atlas'
    await decompress(path.join(platformTmpDir, name), platformTmpDir);
    // remove the archive
    fs.removeSync(path.join(platformTmpDir, name));
    // rename sub-folder 'mykrobe_atlas' -> 'bin'
    fs.renameSync(
      path.join(platformTmpDir, 'mykrobe_atlas'),
      path.join(platformTmpDir, 'bin')
    );
  }
  // rename old desktop folder
  const resourcesBinFolder = path.join(__dirname, 'resources', 'bin');
  if (fs.existsSync(path.join(resourcesBinFolder, 'desktop'))) {
    fs.renameSync(
      path.join(resourcesBinFolder, 'desktop'),
      path.join(resourcesBinFolder, 'desktop.old')
    );
  }
  // move new desktop folder into place
  fs.renameSync(tmpDir, path.join(resourcesBinFolder, 'desktop'));
  // delete tmp folder
  fs.removeSync(tmpDir);
  // update executable display version
  updateStaticPackageJson({ executableVersion: tag });
})();
