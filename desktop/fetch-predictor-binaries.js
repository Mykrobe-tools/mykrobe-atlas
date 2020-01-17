/* @flow */

import download from 'progress-download';
import decompress from 'decompress';
import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';

import debug from 'debug';
const d = debug('mykrobe:desktop-fetch-predictor-binaries');

import { updateStaticPackageJson, fetchGitHubReleases } from './util';

export const getExpectedPlatformAssetsForTag = (tag: string): Array<*> => [
  {
    platform: 'darwin-x64',
    name: `mykrobe.command_line.osx.${tag}.tar.gz`,
  },
  {
    platform: 'win32-x64',
    name: `mykrobe.command_line.windows.${tag}.tar.gz`,
  },
];

export const getDownloads = ({
  release,
  expectedPlatformAssets,
}: any): Array<*> => {
  const downloads = [];
  expectedPlatformAssets.forEach(({ platform, name }) => {
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
  return downloads;
};

export const processDownloads = async (downloads: Array<*>) => {
  const tmpObj = tmp.dirSync({ prefix: 'mykrobe-' });
  const tmpDir = path.join(tmpObj.name, 'desktop');
  d('tmpDir', tmpDir);
  for (let i = 0; i < downloads.length; i++) {
    const { platform, url, name } = downloads[i];
    const platformTmpDir = path.join(tmpDir, platform);
    d(`Downloading ${url}`);
    await download(url, platformTmpDir);
    // decompresses into sub-folder 'mykrobe_atlas'
    d(`Decompressing ${name}`);
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
  const resourcesDesktopFolder = path.join(resourcesBinFolder, 'desktop');
  const resourcesDesktopOldFolder = path.join(
    resourcesBinFolder,
    'desktop.old'
  );
  if (fs.existsSync(resourcesDesktopFolder)) {
    fs.moveSync(
      path.join(resourcesDesktopFolder),
      path.join(resourcesDesktopOldFolder),
      { overwrite: true }
    );
  }
  // move new desktop folder into place
  fs.renameSync(tmpDir, resourcesDesktopFolder);
  // delete tmp folder
  fs.removeSync(tmpDir);
};

export const fetchPredictorBinaries = async () => {
  d('Fetching GitHub releases');
  const releases = await fetchGitHubReleases({
    owner: 'martinghunt',
    repo: 'mykrobe',
  });
  // use the first release
  // TODO: modify - iterate releases until one satisifies the expected download
  const release = releases[0];
  d('Using first GitHub release:', JSON.stringify(release, null, 2));
  const tag = release.tag_name;
  d(`Using release tag ${tag}`);
  const expectedPlatformAssets = getExpectedPlatformAssetsForTag(tag);
  d('expectedPlatformAssets', JSON.stringify(expectedPlatformAssets, null, 2));
  // TODO: fail if we did not find a release with expected assets
  const downloads = getDownloads({ release, expectedPlatformAssets });
  d('downloads', JSON.stringify(downloads, null, 2));
  try {
    d('Processing downloads');
    await processDownloads(downloads);
    // if successful, update executable display version
    d('Updating display executable version');
    updateStaticPackageJson({ executableVersion: tag });
  } catch (e) {
    d(e);
    d('Download and installation failed - nothing changed');
  }
};

(async () => {
  await fetchPredictorBinaries();
})();
